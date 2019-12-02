import Encode from './DSBEncoding';
import Decode from './DSBDecode';
import percentage from 'percentage-calc';

/**
 * Main Library class
 */
export default class DSB {
	/**
	 *
	 * @param {String|Number} username
	 * @param {String|Number} password
	 * @param {String} [cookies=""] If you already have session cookies, you can add them here.
	 * @param {String|Boolean} [cache=false] In the browser just a boolean and in node a path string. If you don't want to use any cache just use undefined, null or false.
	 * @param {Axios} [axios=require('axios')] Pass your custom axios instance if you want.
	 */
	constructor(
		username,
		password,
		cookies = '',
		cache = false,
		axios = require('axios')
	) {
		/**
		 * @private
		 */
		this.username = username;
		/**
		 * @private
		 */
		this.password = password;
		/**
		 * @private
		 */
		this.axios = axios;
		/**
		 * @private
		 */
		this.urls = {
			Data: 'https://app.dsbcontrol.de/JsonHandler.ashx/GetData'
		};
		/**
		 * @private
		 */
		this.cookies = cookies;
		/**
		 * @private
		 */
		this.axios.defaults.headers.common['User-Agent'] =
			'DSBmobile/9759 (iPhone; iOS 13.2.2; Scale/3.00)';
		if (cache) {
			/**
			 * @private
			 */
			this.cache = new DSBSessionStorageManager(cache, this.cookies);
		}
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
		// Progress State: 3
		const response = await this.axios({
			method: 'POST',
			data: {
				req: {
					Data: Encode({
						PushId: '',
						UserId: this.username,
						UserPw: this.password,
						Device: 'iPhone',
						AppVersion: '2.5.6',
						Language: 'en-DE',
						Date: new Date(),
						BundleId: 'de.digitales-schwarzes-brett.dsblight',
						OsVersion: '13.2.2',
						LastUpdate: new Date(),
						AppId: 'BC86F8E5-5D4A-4A19-A317-04D1E52FF9ED'
					}),
					DataType: 1
				}
			},
			url: this.urls.Data,
			onUploadProgress(e) {
				console.log(JSON.stringify(e));
			},
			onDownloadProgress(e) {
				console.log(JSON.stringify(e));
			}
		});
		if (!response.data.d) throw new Error('Invalid data.');
		progress(percentage.from(4, 5));
		const decoded = Decode(response.data.d);
		progress(percentage.from(5, 5));
		return decoded;
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
			if (key === 'MethodName') {
				if (data[key] === method) {
					if (
						typeof data['Root'] === 'object' &&
						Array.isArray(data['Root']['Childs'])
					) {
						let transformData = [];
						for (let o of data['Root']['Childs']) {
							let newObject = {};
							newObject.title = o.Title;
							newObject.id = o.Id;
							newObject.date = o.Date;
							if (o['Childs'].length === 1) {
								newObject.url = o['Childs'][0]['Detail'];
								newObject.preview = o['Childs'][0]['Preview'];
								newObject.secondTitle = o['Childs'][0]['Title'];
							} else {
								newObject.objects = [];
								for (let objectOfArray of o['Childs']) {
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

DSB.Decode = Decode;
DSB.Encode = Encode;
