const Encode = require('./DSBEncoding');
const Decode = require('./DSBDecode');
const percentage = require('percentage-calc');

/**
 * Main Library class
 */
class DSB {

	/**
	 *
	 * @param {String|Number} username
	 * @param {String|Number} password
	 * @param {String} [cookies=""] If you already have session cookies, you can add them here.
	 * @param {String|Boolean} [cache=false] In the browser just a boolean and in node a path string. If you don't want to use any cache just use undefined, null or false.
	 * @param {Axios} [axios=require('axios')] Pass your custom axios instance if you want.
	 */
	constructor(username, password, cookies = "", cache = false, axios = require('axios')) {
		this.username = username;
		this.password = password;
		this.axios = axios;
		this.urls = {
			"login": "https://mobile.dsbcontrol.de/dsbmobilepage.aspx",
			"main": "https://www.dsbmobile.de/",
			"Data": "http://www.dsbmobile.de/JsonHandlerWeb.ashx/GetData",
			"default": "https://www.dsbmobile.de/default.aspx",
			"loginV1": `https://iphone.dsbcontrol.de/iPhoneService.svc/DSB/authid/${this.username}/${this.password}`,
			"timetables": "https://iphone.dsbcontrol.de/iPhoneService.svc/DSB/timetables/",
			"news": "https://iphone.dsbcontrol.de/iPhoneService.svc/DSB/news/"
		};
		this.cookies = cookies;
		this.axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.32 Safari/537.36';
		if (cache) this.cache = new DSBSessionStorageManager(cache, this.cookies);
	}

	/**
	 * @callback ProgressCallback
	 * @param {Number} progress - A number between 0 and 100
	 */

	/**
	 * Fetch data
	 * @param {ProgressCallback} [progress]
	 * @returns {Promise.<Object>}
	 */
	async fetch(progress = () => {}) {
		const cookies = await this._getSession(progress);
		// Progress State: 3
		const response = await this.axios({
			method: "POST",
			data: {
				req: {
					Data: Encode({
						UserId: "",
						UserPw: "",
						Abos: [],
						AppVersion: "2.3",
						Language: "de",
						AppId: "",
						Device: "WebApp",
						PushId: "",
						BundleId: "de.heinekingmedia.inhouse.dsbmobile.web",
						Date: new Date,
						LastUpdate: new Date,
						OsVersion: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
					}),
					DataType: 1
				}
			},
			url: this.urls.Data,
			headers: {
				Bundle_ID: "de.heinekingmedia.inhouse.dsbmobile.web",
				Referer: this.urls.main,
				Cookie: cookies,
				"X-Requested-With": "XMLHttpRequest"
			},
			onUploadProgress(e) {console.log(JSON.stringify(e))},
			onDownloadProgress(e) {console.log(JSON.stringify(e))}
		});
		if (!response.data.d) throw new Error("Invalid data.");
		progress(percentage.from(4, 5));
		const decoded = Decode(response.data.d);
		progress(percentage.from(5, 5));
		return decoded;
	}

	/**
	 * Fetch data from the original iphone api (Only news and timetables supported)
	 * @param {ProgressCallback} [progress]
	 * @returns {Promise.<Object>}
	 */
	async fetchV1(progress = () => {}) {
		let currentProgress = 0;
		const loginV1Response = await this.axios({
			method: "GET",
			url: this.urls.loginV1
		});
		if (loginV1Response.data === "00000000-0000-0000-0000-000000000000") throw new Error("Login failed.");
		const id = loginV1Response.data;
		currentProgress++;
		progress(percentage.from(currentProgress, 5));
		const data = await Promise.all([
			this.axios(this.urls.timetables + id).then(response => {
				currentProgress++;
				progress(percentage.from(currentProgress, 5));
				return Promise.resolve({"timetables": response.data})
			}),
			this.axios(this.urls.news + id).then(response => {
				currentProgress++;
				progress(percentage.from(currentProgress, 5));
				return Promise.resolve({"news": response.data})
			})
		]);
		currentProgress++;
		progress(percentage.from(currentProgress, 5));
		let newData = {};
		for (let fragment of data) {
			for (let key in fragment) {
				if (fragment.hasOwnProperty(key)) {
					newData[key] = fragment[key];
				}
			}
		}
		currentProgress++;
		progress(percentage.from(currentProgress, 5));
		return newData;
	}

	/**
	 * Login with username and password
	 * @param {String|Number} [username=this.username]
	 * @param {String|Number} [password=this.password]
	 * @returns {Promise.<String>}
	 * @private
	 */
	async _login(username = this.username, password = this.password) {
		const response = await this.axios({
			method: "GET",
			url: this.urls.login,
			params: {
				user: username,
				password: password
			},
			validateStatus(status) {
				return (status === 200 || status === 302);
			},
			maxRedirects: 0,
			onUploadProgress(e) {console.log(JSON.stringify(e))},
			onDownloadProgress(e) {console.log(JSON.stringify(e))}
		});
		if (!response.headers['set-cookie']) throw new Error("Login failed. Returned no cookies.");
		this.cookies = response.headers['set-cookie'].join('; ');
		return this.cookies;
	}

	/**
	 * Checks if dsb session cookie is valid
	 * @param {String} [cookies=this.cookies]
	 * @returns {Promise.<boolean>}
	 * @private
	 */
	async _checkCookies(cookies = this.cookies) {
		let returnValue = false;
		try {
			returnValue = !!await this.axios({
				method: "GET",
				url: this.urls.default,
				validateStatus(status) {
					return status === 200;
				},
				maxRedirects: 0,
				headers: {
					Cookie: cookies,
					"Cache-Control": "no-cache",
					Pragma: "no-cache"
				}
			});
		} catch (e) {
			return false;
		} finally {
			return returnValue;
		}
	}

	/**
	 * Get a valid session
	 * @param {Function} [progress]
	 * @returns {Promise.<String>}
	 * @private
	 */
	async _getSession(progress = () => {}) {
		let returnValue;
		try {
			const cookies = this.cookies ? this.cookies : await this.cache.get();
			progress(percentage.from(1, 5));
			if (await this._checkCookies(cookies)) {
				returnValue = cookies;
				progress(percentage.from(3, 5));
			} else {
				returnValue = await this._login();
				progress(percentage.from(2, 5));
				this.cache ? await this.cache.set(returnValue) : this.cookies = returnValue;
				progress(percentage.from(3, 5));
			}
		} catch (e) {
			returnValue = await this._login();
			progress(percentage.from(2, 5));
			this.cache ? await this.cache.set(returnValue) : this.cookies = returnValue;
			progress(percentage.from(3, 5));
		} finally {
			return returnValue;
		}
	}

	/**
	 * [Experimental] Try to get just the important data from the data you get back from fetch()
	 * @param {String} method - The method name to search for (z.B tiles or timetable)
	 * @param {Object} data - Data returned by fetch()
	 * @returns {Object}
	 */
	static findMethodInData(method, data) {
		for (let key in data) {
			if (!data.hasOwnProperty(key)) continue;
			if (key === "MethodName") {
				if (data[key] === method) {
					if (typeof data["Root"] === "object" && Array.isArray(data["Root"]["Childs"])) {
						let transformData = [];
						for (let o of data["Root"]["Childs"]) {
							let newObject = {};
							newObject.title = o.Title;
							newObject.id = o.Id;
							newObject.date = o.Date;
							if (o["Childs"].length === 1) {
								newObject.url = o["Childs"][0]["Detail"];
								newObject.preview = o["Childs"][0]["Preview"];
								newObject.secondTitle = o["Childs"][0]["Title"];
							} else {
								newObject.objects = [];
								for (let objectOfArray of o["Childs"]) {
									newObject.objects.push({
										id: objectOfArray.Id,
										url: objectOfArray.Detail,
										preview: objectOfArray.Preview,
										title: objectOfArray.Title,
										date: objectOfArray.Date
									});
								}
							}
							transformData.push(newObject);
						}
						return {
							method: method,
							data: transformData
						};
					}
				}
			}
			if (Array.isArray(data[key]) || typeof data[key] === 'object') {
				const find = DSB.findMethodInData(method, data[key]);
				if (find) return find;
			}
		}
	}
}

class DSBSessionStorageManager {

	/**
	 * Class to store the dsb session
	 * @param [path=""]
	 * @param [cookies=""]
	 */
	constructor(path = "", cookies = "") {
		this.path = path;
		this.cookies = cookies;
		this.fs = DSBSessionStorageManager.isNode() ? require('fs') : undefined;
	}

	/**
	 * Retrieves session from cache.
	 * @returns {Promise.<String>}
	 */
	async get() {
		if (DSBSessionStorageManager.isNode()) {
			this.cookies = await new Promise((resolve, reject) => {
				this.fs.readFile(this.path, (err, data) => {
					if (err) return reject(err);
					if (typeof data !== "string") {
						let value;
						try {
							value = data.toString();
						} catch (e) {
							return reject(e);
						} finally {
							return resolve(value);
						}
					} else {
						return resolve(data);
					}
				});
			});
			return this.cookies;
		} else {
			if (window.localStorage) {
				return window.localStorage.getItem("DSBSession");
			} else {
				return this.cookies;
			}
		}
	}

	/**
	 * Sets the session in the cache.
	 * @param value
	 * @returns {Promise.<void>}
	 */
	async set(value = "") {
		this.cookies = value;
		if (DSBSessionStorageManager.isNode()) {
			try {
				await new Promise((resolve, reject) => {
					this.fs.writeFile(this.path, value, (err) => {
						if (err) return reject(err);
						return resolve();
					});
				});
			} catch (e) {}
		} else {
			if (window.localStorage) {
				return window.localStorage.setItem("DSBSession", value);
			}
		}
	}

	/**
	 * Checks if this module is running in a browser env or node env.
	 * @returns {boolean}
	 */
	static isNode() {
		return Object.prototype.toString.call(global.process) === '[object process]';
	}
}

module.exports = DSB;
export { DSB, DSBSessionStorageManager};