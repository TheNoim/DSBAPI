'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Encode = require('./DSBEncoding');
var Decode = require('./DSBDecode');
var percentage = require('percentage-calc');

/**
 * Main Library class
 */

var DSB = function () {

	/**
  *
  * @param {String|Number} username
  * @param {String|Number} password
  * @param {String} [cookies=""] If you already have session cookies, you can add them here.
  * @param {String|Boolean} [cache=false] In the browser just a boolean and in node a path string. If you don't want to use any cache just use undefined, null or false.
  * @param {Axios} [axios=require('axios')] Pass your custom axios instance if you want.
  */
	function DSB(username, password) {
		var cookies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
		var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
		var axios = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : require('axios');

		_classCallCheck(this, DSB);

		this.username = username;
		this.password = password;
		this.axios = axios;
		this.urls = {
			"login": "https://mobile.dsbcontrol.de/dsbmobilepage.aspx",
			"main": "https://www.dsbmobile.de/",
			"Data": "http://www.dsbmobile.de/JsonHandlerWeb.ashx/GetData",
			"default": "https://www.dsbmobile.de/default.aspx",
			"loginV1": 'https://iphone.dsbcontrol.de/iPhoneService.svc/DSB/authid/' + this.username + '/' + this.password,
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


	_createClass(DSB, [{
		key: 'fetch',
		value: async function fetch() {
			var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var cookies = await this._getSession(progress);
			// Progress State: 3
			var response = await this.axios({
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
							Date: new Date(),
							LastUpdate: new Date(),
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
				onUploadProgress: function onUploadProgress(e) {
					console.log(JSON.stringify(e));
				},
				onDownloadProgress: function onDownloadProgress(e) {
					console.log(JSON.stringify(e));
				}
			});
			if (!response.data.d) throw new Error("Invalid data.");
			progress(percentage.from(4, 5));
			var decoded = Decode(response.data.d);
			progress(percentage.from(5, 5));
			return decoded;
		}

		/**
   * Fetch data from the original iphone api (Only news and timetables supported)
   * @param {ProgressCallback} [progress]
   * @returns {Promise.<Object>}
   */

	}, {
		key: 'fetchV1',
		value: async function fetchV1() {
			var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var currentProgress = 0;
			var loginV1Response = await this.axios({
				method: "GET",
				url: this.urls.loginV1
			});
			if (loginV1Response.data === "00000000-0000-0000-0000-000000000000") throw new Error("Login failed.");
			var id = loginV1Response.data;
			currentProgress++;
			progress(percentage.from(currentProgress, 5));
			var data = await Promise.all([this.axios(this.urls.timetables + id).then(function (response) {
				currentProgress++;
				progress(percentage.from(currentProgress, 5));
				return Promise.resolve({ "timetables": response.data });
			}), this.axios(this.urls.news + id).then(function (response) {
				currentProgress++;
				progress(percentage.from(currentProgress, 5));
				return Promise.resolve({ "news": response.data });
			})]);
			currentProgress++;
			progress(percentage.from(currentProgress, 5));
			var newData = {};
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var fragment = _step.value;

					for (var key in fragment) {
						if (fragment.hasOwnProperty(key)) {
							newData[key] = fragment[key];
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
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

	}, {
		key: '_login',
		value: async function _login() {
			var username = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.username;
			var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.password;

			var response = await this.axios({
				method: "GET",
				url: this.urls.login,
				params: {
					user: username,
					password: password
				},
				validateStatus: function validateStatus(status) {
					return status === 200 || status === 302;
				},

				maxRedirects: 0,
				onUploadProgress: function onUploadProgress(e) {
					console.log(JSON.stringify(e));
				},
				onDownloadProgress: function onDownloadProgress(e) {
					console.log(JSON.stringify(e));
				}
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

	}, {
		key: '_checkCookies',
		value: async function _checkCookies() {
			var cookies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.cookies;

			var returnValue = false;
			try {
				returnValue = !!(await this.axios({
					method: "GET",
					url: this.urls.default,
					validateStatus: function validateStatus(status) {
						return status === 200;
					},

					maxRedirects: 0,
					headers: {
						Cookie: cookies,
						"Cache-Control": "no-cache",
						Pragma: "no-cache"
					}
				}));
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

	}, {
		key: '_getSession',
		value: async function _getSession() {
			var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

			var returnValue = void 0;
			try {
				var cookies = this.cookies ? this.cookies : await this.cache.get();
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

	}], [{
		key: 'findMethodInData',
		value: function findMethodInData(method, data) {
			for (var key in data) {
				if (!data.hasOwnProperty(key)) continue;
				if (key === "MethodName") {
					if (data[key] === method) {
						if (_typeof(data["Root"]) === "object" && Array.isArray(data["Root"]["Childs"])) {
							var transformData = [];
							var _iteratorNormalCompletion2 = true;
							var _didIteratorError2 = false;
							var _iteratorError2 = undefined;

							try {
								for (var _iterator2 = data["Root"]["Childs"][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
									var o = _step2.value;

									var newObject = {};
									newObject.title = o.Title;
									newObject.id = o.Id;
									newObject.date = o.Date;
									if (o["Childs"].length === 1) {
										newObject.url = o["Childs"][0]["Detail"];
										newObject.preview = o["Childs"][0]["Preview"];
										newObject.secondTitle = o["Childs"][0]["Title"];
									} else {
										newObject.objects = [];
										var _iteratorNormalCompletion3 = true;
										var _didIteratorError3 = false;
										var _iteratorError3 = undefined;

										try {
											for (var _iterator3 = o["Childs"][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
												var objectOfArray = _step3.value;

												newObject.objects.push({
													id: objectOfArray.Id,
													url: objectOfArray.Detail,
													preview: objectOfArray.Preview,
													title: objectOfArray.Title,
													date: objectOfArray.Date
												});
											}
										} catch (err) {
											_didIteratorError3 = true;
											_iteratorError3 = err;
										} finally {
											try {
												if (!_iteratorNormalCompletion3 && _iterator3.return) {
													_iterator3.return();
												}
											} finally {
												if (_didIteratorError3) {
													throw _iteratorError3;
												}
											}
										}
									}
									transformData.push(newObject);
								}
							} catch (err) {
								_didIteratorError2 = true;
								_iteratorError2 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion2 && _iterator2.return) {
										_iterator2.return();
									}
								} finally {
									if (_didIteratorError2) {
										throw _iteratorError2;
									}
								}
							}

							return {
								method: method,
								data: transformData
							};
						}
					}
				}
				if (Array.isArray(data[key]) || _typeof(data[key]) === 'object') {
					var find = DSB.findMethodInData(method, data[key]);
					if (find) return find;
				}
			}
		}
	}]);

	return DSB;
}();

var DSBSessionStorageManager = function () {

	/**
  * Class to store the dsb session
  * @param [path=""]
  * @param [cookies=""]
  */
	function DSBSessionStorageManager() {
		var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
		var cookies = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

		_classCallCheck(this, DSBSessionStorageManager);

		this.path = path;
		this.cookies = cookies;
		this.fs = DSBSessionStorageManager.isNode() ? require('fs') : undefined;
	}

	/**
  * Retrieves session from cache.
  * @returns {Promise.<String>}
  */


	_createClass(DSBSessionStorageManager, [{
		key: 'get',
		value: async function get() {
			var _this = this;

			if (DSBSessionStorageManager.isNode()) {
				this.cookies = await new Promise(function (resolve, reject) {
					_this.fs.readFile(_this.path, function (err, data) {
						if (err) return reject(err);
						if (typeof data !== "string") {
							var value = void 0;
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

	}, {
		key: 'set',
		value: async function set() {
			var _this2 = this;

			var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

			this.cookies = value;
			if (DSBSessionStorageManager.isNode()) {
				try {
					await new Promise(function (resolve, reject) {
						_this2.fs.writeFile(_this2.path, value, function (err) {
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

	}], [{
		key: 'isNode',
		value: function isNode() {
			return Object.prototype.toString.call(global.process) === '[object process]';
		}
	}]);

	return DSBSessionStorageManager;
}();

exports.default = DSB;
module.exports = exports['default'];

