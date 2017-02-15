/**
 * Created by nilsbergmann on 14.02.17.
 */

const Encode = require('./DSBEncoding');
const Decode = require('./DSBDecode');
const request = require('request');
const cheerio = require('cheerio');
const Jar = request.jar();
const tough = require('tough-cookie');
const Cookie = tough.Cookie;
const cookiejar = new tough.CookieJar();

request('http://mobile.dsbcontrol.de/Login.aspx', {jar: Jar},(error, response, body) => {
    if (!error && response.statusCode == 200){
        for (let CookieI in response.headers['set-cookie']){
            if (response.headers['set-cookie'].hasOwnProperty(CookieI)){
                cookiejar.setCookieSync(Cookie.parse(response.headers['set-cookie'][CookieI]), 'http://mobile.dsbcontrol.de/');
            }
        }
        const $ = cheerio.load(body);
        const __VIEWSTATEGENERATOR = $("#__VIEWSTATEGENERATOR").attr('value') || "";
        const __EVENTTARGET = $("#__EVENTTARGET").attr('value') || "";
        const __EVENTARGUMENT = $("#__EVENTARGUMENT").attr('value') || "";
        const __EVENTVALIDATION = $("#__EVENTVALIDATION").attr('value') || "";
        const __VIEWSTATE = $("#__VIEWSTATE").attr('value') || "";
        const __LASTFOCUS = $("#__LASTFOCUS").attr('value') || "";
        request('http://mobile.dsbcontrol.de/Login.aspx',{
            method: "POST",
            jar: Jar,
            headers: {
                Referer: "http://mobile.dsbcontrol.de/Login.aspx"
            },
            form: {
                __VIEWSTATEGENERATOR: __VIEWSTATEGENERATOR,
                __EVENTTARGET: __EVENTTARGET,
                __EVENTARGUMENT: __EVENTARGUMENT,
                __EVENTVALIDATION: __EVENTVALIDATION,
                __VIEWSTATE: __VIEWSTATE,
                __LASTFOCUS: __LASTFOCUS,
                txtUser: 326781,
                txtPass: "MCG-Plan",
                ctl03: "Anmelden"
            }
        } ,(error, response, body) => {
            if (!error && response.statusCode == 200 || 302){
                for (let CookieIndex in response.headers['set-cookie']){
                    if (response.headers['set-cookie'].hasOwnProperty(CookieIndex)){
                        cookiejar.setCookieSync(Cookie.parse(response.headers['set-cookie'][CookieIndex]), 'http://mobile.dsbcontrol.de/');
                    }
                }
                const data = {
                    req: {
                        Data: Encode({
                            UserId: "",
                            UserPw: "",
                            Abos: Array(),
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
                console.log(cookiejar.getSetCookieStringsSync('http://mobile.dsbcontrol.de/'));
                request('http://www.dsbmobile.de/JsonHandlerWeb.ashx/GetData', {
                    method: "POST",
                    jar: Jar,
                    gzip: true,
                    "X-Requested-With": "XMLHttpRequest",
                    headers: {
                        Bundle_ID: "de.heinekingmedia.inhouse.dsbmobile.web",
                        Referer: 'http://mobile.dsbcontrol.de/',
                        Cookie: cookiejar.getSetCookieStringsSync('http://mobile.dsbcontrol.de/')
                    },
                    json: true,
                    body: data
                }, (error, response, body) => {
                    if (!error && response.statusCode == 200 || 302){
                        console.log(JSON.stringify(response));
                        console.log("-----------");
                        console.log(JSON.stringify(Decode(response.body.d)));
                    } else {
                        throw error || response.statusCode;
                    }
                });
            } else {
                throw error || response.statusCode;
            }
        });

    } else {
        throw error || response.statusCode;
    }
});



