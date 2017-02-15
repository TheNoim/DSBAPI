/**
 * Created by nilsbergmann on 15.02.17.
 */
const Promise = require('bluebird');
const tough = require('tough-cookie');
const request = require('request');
const fs = require('fs-extra');
const Encode = require('./DSBEncoding');
const Decode = require('./DSBDecode');
const cheerio = require('cheerio');
const Cookie = tough.Cookie;

class DSB {

    constructor(username, password, cookieJar) {

        this.username = username;
        this.password = password;

        this.cookieJarPath = cookieJar || null;
        this.jar = new tough.CookieJar();

        this.urls = {
            "login": "http://mobile.dsbcontrol.de/Login.aspx",
            "main": "http://mobile.dsbcontrol.de/",
            "Data": "http://www.dsbmobile.de/JsonHandlerWeb.ashx/GetData"
        };

        this._login = this._login.bind(this);
        this._validateLogin = this._validateLogin.bind(this);
        this._loadCookies = this._loadCookies.bind(this);
        this._saveCookies = this._saveCookies.bind(this);

        this._loadCookies();
    }

    _login() {
        const self = this;
        return new Promise((resolve, reject) => {
            request(this.urls.login, (error, response, body) => {
                if (!error && response.statusCode == 200 || 302){
                    for (let CookieI in response.headers['set-cookie']){
                        if (response.headers['set-cookie'].hasOwnProperty(CookieI)){
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
                        if (!error && response.statusCode == 200 || 302){
                            for (let CookieIndex in response.headers['set-cookie']){
                                if (response.headers['set-cookie'].hasOwnProperty(CookieIndex)){
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

    _saveCookies(){
        if (!this.cookieJarPath) return;
        fs.writeJSONSync(this.cookieJarPath, this.jar.getSetCookieStringsSync(this.urls.main));
    }

    _validateLogin() {
        const self = this;
        return new Promise((resolve, reject) => {
            request(self.urls.main, {
                headers: {
                    Cookie: self.jar.getSetCookieStringsSync(self.urls.main)
                }
            }, (error, response) => {
                if (!error && response.statusCode == 200 || 302){
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    _loadCookies(){
        if (!this.cookieJarPath) return;
        const cookies = fs.readJSONSync(this.cookieJarPath);
        for (let I in cookies){
            if (!cookies.hasOwnProperty(I)) continue;
            this.jar.setCookieSync(Cookie.parse(cookies[I]), this.urls.main);
        }
    }
}

module.exports = DSB;