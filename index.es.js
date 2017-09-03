'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DSBSessionStorageManager = exports.DSB = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
		(0, _classCallCheck3.default)(this, DSB);

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


	(0, _createClass3.default)(DSB, [{
		key: 'fetch',
		value: function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
				var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
				var cookies, response, decoded;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this._getSession(progress);

							case 2:
								cookies = _context.sent;
								_context.next = 5;
								return this.axios({
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
										console.log((0, _stringify2.default)(e));
									},
									onDownloadProgress: function onDownloadProgress(e) {
										console.log((0, _stringify2.default)(e));
									}
								});

							case 5:
								response = _context.sent;

								if (response.data.d) {
									_context.next = 8;
									break;
								}

								throw new Error("Invalid data.");

							case 8:
								progress(percentage.from(4, 5));
								decoded = Decode(response.data.d);

								progress(percentage.from(5, 5));
								return _context.abrupt('return', decoded);

							case 12:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function fetch() {
				return _ref.apply(this, arguments);
			}

			return fetch;
		}()

		/**
   * Fetch data from the original iphone api (Only news and timetables supported)
   * @param {ProgressCallback} [progress]
   * @returns {Promise.<Object>}
   */

	}, {
		key: 'fetchV1',
		value: function () {
			var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
				var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

				var currentProgress, loginV1Response, id, data, newData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fragment, key;

				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								currentProgress = 0;
								_context2.next = 3;
								return this.axios({
									method: "GET",
									url: this.urls.loginV1
								});

							case 3:
								loginV1Response = _context2.sent;

								if (!(loginV1Response.data === "00000000-0000-0000-0000-000000000000")) {
									_context2.next = 6;
									break;
								}

								throw new Error("Login failed.");

							case 6:
								id = loginV1Response.data;

								currentProgress++;
								progress(percentage.from(currentProgress, 5));
								_context2.next = 11;
								return _promise2.default.all([this.axios(this.urls.timetables + id).then(function (response) {
									currentProgress++;
									progress(percentage.from(currentProgress, 5));
									return _promise2.default.resolve({ "timetables": response.data });
								}), this.axios(this.urls.news + id).then(function (response) {
									currentProgress++;
									progress(percentage.from(currentProgress, 5));
									return _promise2.default.resolve({ "news": response.data });
								})]);

							case 11:
								data = _context2.sent;

								currentProgress++;
								progress(percentage.from(currentProgress, 5));
								newData = {};
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context2.prev = 18;

								for (_iterator = (0, _getIterator3.default)(data); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
									fragment = _step.value;

									for (key in fragment) {
										if (fragment.hasOwnProperty(key)) {
											newData[key] = fragment[key];
										}
									}
								}
								_context2.next = 26;
								break;

							case 22:
								_context2.prev = 22;
								_context2.t0 = _context2['catch'](18);
								_didIteratorError = true;
								_iteratorError = _context2.t0;

							case 26:
								_context2.prev = 26;
								_context2.prev = 27;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 29:
								_context2.prev = 29;

								if (!_didIteratorError) {
									_context2.next = 32;
									break;
								}

								throw _iteratorError;

							case 32:
								return _context2.finish(29);

							case 33:
								return _context2.finish(26);

							case 34:
								currentProgress++;
								progress(percentage.from(currentProgress, 5));
								return _context2.abrupt('return', newData);

							case 37:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this, [[18, 22, 26, 34], [27,, 29, 33]]);
			}));

			function fetchV1() {
				return _ref2.apply(this, arguments);
			}

			return fetchV1;
		}()

		/**
   * Login with username and password
   * @param {String|Number} [username=this.username]
   * @param {String|Number} [password=this.password]
   * @returns {Promise.<String>}
   * @private
   */

	}, {
		key: '_login',
		value: function () {
			var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
				var username = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.username;
				var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.password;
				var response;
				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return this.axios({
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
										console.log((0, _stringify2.default)(e));
									},
									onDownloadProgress: function onDownloadProgress(e) {
										console.log((0, _stringify2.default)(e));
									}
								});

							case 2:
								response = _context3.sent;

								if (response.headers['set-cookie']) {
									_context3.next = 5;
									break;
								}

								throw new Error("Login failed. Returned no cookies.");

							case 5:
								this.cookies = response.headers['set-cookie'].join('; ');
								return _context3.abrupt('return', this.cookies);

							case 7:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function _login() {
				return _ref3.apply(this, arguments);
			}

			return _login;
		}()

		/**
   * Checks if dsb session cookie is valid
   * @param {String} [cookies=this.cookies]
   * @returns {Promise.<boolean>}
   * @private
   */

	}, {
		key: '_checkCookies',
		value: function () {
			var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
				var cookies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.cookies;
				var returnValue;
				return _regenerator2.default.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								returnValue = false;
								_context4.prev = 1;
								_context4.next = 4;
								return this.axios({
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
								});

							case 4:
								returnValue = !!_context4.sent;
								_context4.next = 10;
								break;

							case 7:
								_context4.prev = 7;
								_context4.t0 = _context4['catch'](1);
								return _context4.abrupt('return', false);

							case 10:
								_context4.prev = 10;
								return _context4.abrupt('return', returnValue);

							case 13:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this, [[1, 7, 10, 13]]);
			}));

			function _checkCookies() {
				return _ref4.apply(this, arguments);
			}

			return _checkCookies;
		}()

		/**
   * Get a valid session
   * @param {Function} [progress]
   * @returns {Promise.<String>}
   * @private
   */

	}, {
		key: '_getSession',
		value: function () {
			var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
				var progress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
				var returnValue, cookies;
				return _regenerator2.default.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								returnValue = void 0;
								_context5.prev = 1;

								if (!this.cookies) {
									_context5.next = 6;
									break;
								}

								_context5.t0 = this.cookies;
								_context5.next = 9;
								break;

							case 6:
								_context5.next = 8;
								return this.cache.get();

							case 8:
								_context5.t0 = _context5.sent;

							case 9:
								cookies = _context5.t0;

								progress(percentage.from(1, 5));
								_context5.next = 13;
								return this._checkCookies(cookies);

							case 13:
								if (!_context5.sent) {
									_context5.next = 18;
									break;
								}

								returnValue = cookies;
								progress(percentage.from(3, 5));
								_context5.next = 29;
								break;

							case 18:
								_context5.next = 20;
								return this._login();

							case 20:
								returnValue = _context5.sent;

								progress(percentage.from(2, 5));

								if (!this.cache) {
									_context5.next = 27;
									break;
								}

								_context5.next = 25;
								return this.cache.set(returnValue);

							case 25:
								_context5.next = 28;
								break;

							case 27:
								this.cookies = returnValue;

							case 28:
								progress(percentage.from(3, 5));

							case 29:
								_context5.next = 44;
								break;

							case 31:
								_context5.prev = 31;
								_context5.t1 = _context5['catch'](1);
								_context5.next = 35;
								return this._login();

							case 35:
								returnValue = _context5.sent;

								progress(percentage.from(2, 5));

								if (!this.cache) {
									_context5.next = 42;
									break;
								}

								_context5.next = 40;
								return this.cache.set(returnValue);

							case 40:
								_context5.next = 43;
								break;

							case 42:
								this.cookies = returnValue;

							case 43:
								progress(percentage.from(3, 5));

							case 44:
								_context5.prev = 44;
								return _context5.abrupt('return', returnValue);

							case 47:
							case 'end':
								return _context5.stop();
						}
					}
				}, _callee5, this, [[1, 31, 44, 47]]);
			}));

			function _getSession() {
				return _ref5.apply(this, arguments);
			}

			return _getSession;
		}()

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
						if ((0, _typeof3.default)(data["Root"]) === "object" && Array.isArray(data["Root"]["Childs"])) {
							var transformData = [];
							var _iteratorNormalCompletion2 = true;
							var _didIteratorError2 = false;
							var _iteratorError2 = undefined;

							try {
								for (var _iterator2 = (0, _getIterator3.default)(data["Root"]["Childs"]), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
											for (var _iterator3 = (0, _getIterator3.default)(o["Childs"]), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
				if (Array.isArray(data[key]) || (0, _typeof3.default)(data[key]) === 'object') {
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
		(0, _classCallCheck3.default)(this, DSBSessionStorageManager);

		this.path = path;
		this.cookies = cookies;
		this.fs = DSBSessionStorageManager.isNode() ? require('fs') : undefined;
	}

	/**
  * Retrieves session from cache.
  * @returns {Promise.<String>}
  */


	(0, _createClass3.default)(DSBSessionStorageManager, [{
		key: 'get',
		value: function () {
			var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
				var _this = this;

				return _regenerator2.default.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								if (!DSBSessionStorageManager.isNode()) {
									_context6.next = 7;
									break;
								}

								_context6.next = 3;
								return new _promise2.default(function (resolve, reject) {
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

							case 3:
								this.cookies = _context6.sent;
								return _context6.abrupt('return', this.cookies);

							case 7:
								if (!window.localStorage) {
									_context6.next = 11;
									break;
								}

								return _context6.abrupt('return', window.localStorage.getItem("DSBSession"));

							case 11:
								return _context6.abrupt('return', this.cookies);

							case 12:
							case 'end':
								return _context6.stop();
						}
					}
				}, _callee6, this);
			}));

			function get() {
				return _ref6.apply(this, arguments);
			}

			return get;
		}()

		/**
   * Sets the session in the cache.
   * @param value
   * @returns {Promise.<void>}
   */

	}, {
		key: 'set',
		value: function () {
			var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
				var _this2 = this;

				var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
				return _regenerator2.default.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								this.cookies = value;

								if (!DSBSessionStorageManager.isNode()) {
									_context7.next = 11;
									break;
								}

								_context7.prev = 2;
								_context7.next = 5;
								return new _promise2.default(function (resolve, reject) {
									_this2.fs.writeFile(_this2.path, value, function (err) {
										if (err) return reject(err);
										return resolve();
									});
								});

							case 5:
								_context7.next = 9;
								break;

							case 7:
								_context7.prev = 7;
								_context7.t0 = _context7['catch'](2);

							case 9:
								_context7.next = 13;
								break;

							case 11:
								if (!window.localStorage) {
									_context7.next = 13;
									break;
								}

								return _context7.abrupt('return', window.localStorage.setItem("DSBSession", value));

							case 13:
							case 'end':
								return _context7.stop();
						}
					}
				}, _callee7, this, [[2, 7]]);
			}));

			function set() {
				return _ref7.apply(this, arguments);
			}

			return set;
		}()

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

module.exports = DSB;
exports.DSB = DSB;
exports.DSBSessionStorageManager = DSBSessionStorageManager;

