const Promise = require('bluebird');
const tough = require('tough-cookie');
const request = require('request');
const fs = require('fs-extra');
const Encode = require('./DSBEncoding');
const Decode = require('./DSBDecode');
const cheerio = require('cheerio');
const Cookie = tough.Cookie;
const oc = require('optional-callback');

class DSB {

    /**
     *
     * @param {string} username The username for your school
     * @param {string} password The password for your school
     * @param {string} cookieJar=null Optional path to a file for caching the login cookies
     */
    constructor(username, password, cookieJar) {

        this.username = username;
        this.password = password;

        this.cookieJarPath = cookieJar || null;
        this.jar = new tough.CookieJar();

        this.urls = {
            "login": "http://mobile.dsbcontrol.de/Login.aspx",
            "main": "http://mobile.dsbcontrol.de/",
            "Data": "http://www.dsbmobile.de/JsonHandlerWeb.ashx/GetData",
            "default": "http://mobile.dsbcontrol.de/default.aspx",
            "loginV1": `https://iphone.dsbcontrol.de/iPhoneService.svc/DSB/authid/${this.username}/${this.password}`,
            "timetables": "https://iphone.dsbcontrol.de/iPhoneService.svc/DSB/timetables/"
        };

        this._login = this._login.bind(this);
        this._validateLogin = this._validateLogin.bind(this);
        this._loadCookies = this._loadCookies.bind(this);
        this._saveCookies = this._saveCookies.bind(this);
        this._getData = this._getData.bind(this);
        this.getData = this.getData.bind(this);
        this.getDataV1 = this.getDataV1.bind(this);

        this._login = oc(this._login);
        this._validateLogin = oc(this._validateLogin);
        this._getData = oc(this._getData);
        this.getData = oc(this.getData);
        this.getDataV1 = oc(this.getDataV1);

        this._loadCookies();
    }

    /**
     * @param {Function} [Callback=null] If you add a callback, no Promise will be returned.
     * @description Get data from mobile.dsbcontrol.de (The API used by mobile.dsbcontrol.de and every APP)
     * @return {Promise<Object>}
     */
    getData(Callback) {
        const self = this;
        return new Promise((resolve, reject) => {
            return self._validateLogin().then(login => {
                if (login) {
                    return self._getData();
                } else {
                    return self._login().then(() => {
                        return self._getData();
                    });
                }
            }).then(Data => {
                resolve(Data);
            }).catch(reject);
        });
    }

    /**
     * @param {Function} [Callback=null] If you add a callback, no Promise will be returned.
     * @description Get the data from the old API (https://iphone.dsbcontrol.de/)
     */
    getDataV1(Callback) {
        const self = this;
        return new Promise((resolve, reject) => {
            request(self.urls.loginV1, {json: true}, (error, response, body) => {
                if (!error && response.statusCode == 200){
                    if (body != "00000000-0000-0000-0000-000000000000"){
                        request(self.urls.timetables + body, {json: true}, (error, response, body) => {
                            if (!error && response.statusCode == 200){
                                resolve(body);
                            } else {
                                reject(error || {statusCode: response.statusCode, body: body});
                            }
                        });
                    } else {
                        reject({statusCode: response.statusCode, body: body, message: "Wrong username or password"});
                    }
                } else {
                    reject(error || {statusCode: response.statusCode, body: body});
                }
            });
        });
    }

    /**
     *
     * @private
     */
    _getData() {
        const self = this;
        return new Promise((resolve, reject) => {
            const data = {
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
            };
            request(self.urls.Data, {
                method: "POST",
                gzip: true,
                "X-Requested-With": "XMLHttpRequest",
                headers: {
                    Bundle_ID: "de.heinekingmedia.inhouse.dsbmobile.web",
                    Referer: self.urls.main,
                    Cookie: self.jar.getCookieStringSync(self.urls.main)
                },
                json: true,
                body: data
            }, (error, response, body) => {
                if (!error && response.statusCode == 200 || 302) {
                    resolve(Decode(response.body.d));
                } else {
                    reject(error || {statusCode: response.statusCode, body: body});
                }
            });
        });
    }

    /**
     *
     * @private
     */
    _login() {
        const self = this;
        return new Promise((resolve, reject) => {
            request(this.urls.login, (error, response, body) => {
                if (!error && response.statusCode == 200 || 302) {
                    for (let CookieI in response.headers['set-cookie']) {
                        if (response.headers['set-cookie'].hasOwnProperty(CookieI)) {
                            self.jar.setCookieSync(Cookie.parse(response.headers['set-cookie'][CookieI]), self.urls.main);
                        }
                    }
                    self._saveCookies();
                    const $ = cheerio.load(body);
                    const __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").attr('value') || "";
                    const __EVENTTARGET = $("#__EVENTTARGET").attr('value') || "";
                    const __EVENTARGUMENT = $("#__EVENTARGUMENT").attr('value') || "";
                    const __EVENTVALIDATION = $("#__EVENTVALIDATION").attr('value') || "";
                    const __VIEWSTATE = $("#__VIEWSTATE").attr('value') || "";
                    const __LASTFOCUS = $("#__LASTFOCUS").attr('value') || "";
                    request(self.urls.login, {
                        method: "POST",
                        headers: {
                            Referer: self.urls.login
                        },
                        form: {
                            __VIEWSTATEGENERATOR: __VIEWSTATEGENERATOR,
                            __EVENTTARGET: __EVENTTARGET,
                            __EVENTARGUMENT: __EVENTARGUMENT,
                            __EVENTVALIDATION: __EVENTVALIDATION,
                            __VIEWSTATE: __VIEWSTATE,
                            __LASTFOCUS: __LASTFOCUS,
                            txtUser: self.username,
                            txtPass: self.password,
                            ctl03: "Anmelden"
                        }
                    }, (error, response, body) => {
                        if (!error && response.statusCode == 200 || 302) {
                            for (let CookieIndex in response.headers['set-cookie']) {
                                if (response.headers['set-cookie'].hasOwnProperty(CookieIndex)) {
                                    self.jar.setCookieSync(Cookie.parse(response.headers['set-cookie'][CookieIndex]), self.urls.main);
                                }
                            }
                            self._saveCookies();
                            resolve();
                        } else {
                            reject(error || {statusCode: response.statusCode, body: body});
                        }


                    });
                } else {
                    reject(error || {statusCode: response.statusCode, body: body});
                }
            });
        });
    }

    /**
     *
     * @private
     */
    _saveCookies() {
        if (!this.cookieJarPath) return;
        fs.writeJsonSync(this.cookieJarPath, this.jar.getSetCookieStringsSync(this.urls.main));
    }

    /**
     *
     * @private
     */
    _validateLogin() {
        const self = this;
        return new Promise((resolve, reject) => {
            request(self.urls.default, {
                headers: {
                    Cookie: self.jar.getCookieStringSync(self.urls.main),
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                },
                followRedirect: false
            }, (error, response) => {
                if (!error && response.statusCode == 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     *
     * @private
     */
    _loadCookies() {
        if (!this.cookieJarPath) return;
        fs.ensureFileSync(this.cookieJarPath);
        fs.accessSync(this.cookieJarPath, fs.constants.F_OK || fs.constants.R_OK || fs.constants.W_OK);
        const cookies = fs.readJSONSync(this.cookieJarPath, {throws: false}) || [];
        for (let I in cookies) {
            if (!cookies.hasOwnProperty(I)) continue;
            this.jar.setCookieSync(Cookie.parse(cookies[I]), this.urls.main);
        }
    }
}

module.exports = DSB;