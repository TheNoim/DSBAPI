/**
 * Created by nilsbergmann on 14.02.17.
 */
const pako = require('pako');
function atob(a) {
    for (var b, c, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e = String(a).replace(/=+$/, ""), f = 0, g = 0, h = ""; c = e.charAt(g++); ~c && (b = f % 4 ? 64 * b + c : c,
    f++ % 4) ? h += String.fromCharCode(255 & b >> (-2 * f & 6)) : 0)
        c = d.indexOf(c);
    return h
}

module.exports = function (ToDecode) {
    var b = StringView.base64ToBytes(ToDecode)
        , c = pako.inflate(b)
        , d = new StringView(c)
        , e = d.toString()
        , f = JSON.parse(e);
    return f
};


"use strict";
function StringView(a, b, c, d) {
    var e, f, g, h, i, j, k = isFinite(c) ? c : 0, l = 15;
    b && (this.encoding = b.toString());
    a: switch (this.encoding) {
        case "UTF-8":
            h = StringView.putUTF8CharCode,
                i = StringView.getUTF8CharLength,
                e = Uint8Array;
            break a;
        case "UTF-16":
            h = StringView.putUTF16CharCode,
                i = StringView.getUTF16CharLength,
                e = Uint16Array;
            break a;
        case "UTF-32":
            e = Uint32Array,
                l &= 14;
            break a;
        default:
            e = Uint8Array,
                l &= 14
    }
    a: switch (typeof a) {
        case "string":
            l &= 7;
            break a;
        case "object":
            switch (a.constructor) {
                case StringView:
                    l &= 3;
                    break a;
                case String:
                    l &= 7;
                    break a;
                case ArrayBuffer:
                    f = new e(a),
                        j = "UTF-32" === this.encoding ? a.byteLength >>> 2 : "UTF-16" === this.encoding ? a.byteLength >>> 1 : a.byteLength,
                        g = 0 !== k || isFinite(d) && d !== j ? new e(a,k,isFinite(d) ? d : j - k) : f;
                    break a;
                case Uint32Array:
                case Uint16Array:
                case Uint8Array:
                    e = a.constructor,
                        j = a.length,
                        f = 0 === a.byteOffset && a.length === (e === Uint32Array ? a.buffer.byteLength >>> 2 : e === Uint16Array ? a.buffer.byteLength >>> 1 : a.buffer.byteLength) ? a : new e(a.buffer),
                        g = 0 !== k || isFinite(d) && d !== j ? a.subarray(k, isFinite(d) ? k + d : j) : a;
                    break a;
                default:
                    f = new e(a),
                        j = f.length,
                        g = 0 !== k || isFinite(d) && d !== j ? f.subarray(k, isFinite(d) ? k + d : j) : f
            }
            break a;
        default:
            f = g = new e(Number(a) || 0)
    }
    if (8 > l) {
        var m, n, o, p, q, r, s;
        4 & l ? (m = a,
                n = j = m.length,
                l ^= "UTF-32" === this.encoding ? 0 : 2,
                k = o = c ? Math.max((n + c) % n, 0) : 0,
                q = p = (Number.isInteger(d) ? Math.min(Math.max(d, 0) + k, n) : n) - 1) : (m = a.rawData,
                j = a.makeIndex(),
                k = o = c ? Math.max((j + c) % j, 0) : 0,
                n = Number.isInteger(d) ? Math.min(Math.max(d, 0), j - o) : j,
                q = p = n + o,
                "UTF-8" === a.encoding ? (r = StringView.getUTF8CharLength,
                        s = StringView.loadUTF8CharCode) : "UTF-16" === a.encoding ? (r = StringView.getUTF16CharLength,
                            s = StringView.loadUTF16CharCode) : l &= 1),
        (0 === n || 4 > l && m.encoding === this.encoding && 0 === o && n === j) && (l = 7);
        a: switch (l) {
            case 0:
                f = new e(n);
                for (var t = 0; n > t; f[t] = m[k + t++])
                    ;
                break a;
            case 1:
                n = 0;
                for (var u = k; q > u; u++)
                    n += i(m[u]);
                f = new e(n);
                for (var u = k, t = 0; n > t; u++)
                    t = h(f, m[u], t);
                break a;
            case 2:
                k = 0;
                var v;
                for (w = 0; o > w; w++)
                    v = s(m, k),
                        k += r(v);
                f = new e(n);
                for (var u = k, t = 0; n > t; u += r(v),
                    t++)
                    v = s(m, u),
                        f[t] = v;
                break a;
            case 3:
                n = 0;
                for (var v, w = 0, u = 0; p > w; u += r(v))
                    v = s(m, u),
                    w === o && (k = u),
                    ++w > o && (n += i(v));
                f = new e(n);
                for (var u = k, t = 0; n > t; u += r(v))
                    v = s(m, u),
                        t = h(f, v, t);
                break a;
            case 4:
                f = new e(n);
                for (var x = 0; n > x; x++)
                    f[x] = 255 & m.charCodeAt(x);
                break a;
            case 5:
                n = 0;
                for (var y = 0; j > y; y++)
                    y === o && (k = n),
                        n += i(m.charCodeAt(y)),
                    y === p && (q = n);
                f = new e(n);
                for (var t = 0, w = 0; n > t; w++)
                    t = h(f, m.charCodeAt(w), t);
                break a;
            case 6:
                f = new e(n);
                for (var x = 0; n > x; x++)
                    f[x] = m.charCodeAt(x);
                break a;
            case 7:
                f = new e(n ? m : 0)
        }
        g = l > 3 && (k > 0 || q < f.length - 1) ? f.subarray(k, q) : f
    }
    this.buffer = f.buffer,
        this.bufferView = f,
        this.rawData = g,
        Object.freeze(this)
}
Number.isInteger || (Number.isInteger = function(a) {
        return "number" == typeof a && isFinite(a) && a > -9007199254740992 && 9007199254740992 > a && Math.floor(a) === a
    }
),
    StringView.loadUTF8CharCode = function(a, b) {
        var c = a.length
            , d = a[b];
        return d > 251 && 254 > d && c > b + 5 ? 1073741824 * (d - 252) + (a[b + 1] - 128 << 24) + (a[b + 2] - 128 << 18) + (a[b + 3] - 128 << 12) + (a[b + 4] - 128 << 6) + a[b + 5] - 128 : d > 247 && 252 > d && c > b + 4 ? (d - 248 << 24) + (a[b + 1] - 128 << 18) + (a[b + 2] - 128 << 12) + (a[b + 3] - 128 << 6) + a[b + 4] - 128 : d > 239 && 248 > d && c > b + 3 ? (d - 240 << 18) + (a[b + 1] - 128 << 12) + (a[b + 2] - 128 << 6) + a[b + 3] - 128 : d > 223 && 240 > d && c > b + 2 ? (d - 224 << 12) + (a[b + 1] - 128 << 6) + a[b + 2] - 128 : d > 191 && 224 > d && c > b + 1 ? (d - 192 << 6) + a[b + 1] - 128 : d
    }
    ,
    StringView.putUTF8CharCode = function(a, b, c) {
        var d = c;
        return 128 > b ? a[d++] = b : 2048 > b ? (a[d++] = 192 + (b >>> 6),
                    a[d++] = 128 + (63 & b)) : 65536 > b ? (a[d++] = 224 + (b >>> 12),
                        a[d++] = 128 + (b >>> 6 & 63),
                        a[d++] = 128 + (63 & b)) : 2097152 > b ? (a[d++] = 240 + (b >>> 18),
                            a[d++] = 128 + (b >>> 12 & 63),
                            a[d++] = 128 + (b >>> 6 & 63),
                            a[d++] = 128 + (63 & b)) : 67108864 > b ? (a[d++] = 248 + (b >>> 24),
                                a[d++] = 128 + (b >>> 18 & 63),
                                a[d++] = 128 + (b >>> 12 & 63),
                                a[d++] = 128 + (b >>> 6 & 63),
                                a[d++] = 128 + (63 & b)) : (a[d++] = 252 + b / 1073741824,
                                a[d++] = 128 + (b >>> 24 & 63),
                                a[d++] = 128 + (b >>> 18 & 63),
                                a[d++] = 128 + (b >>> 12 & 63),
                                a[d++] = 128 + (b >>> 6 & 63),
                                a[d++] = 128 + (63 & b)),
            d
    }
    ,
    StringView.getUTF8CharLength = function(a) {
        return 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 2097152 > a ? 4 : 67108864 > a ? 5 : 6
    }
    ,
    StringView.loadUTF16CharCode = function(a, b) {
        var c = a[b];
        return c > 55231 && b + 1 < a.length ? (c - 55296 << 10) + a[b + 1] + 9216 : c
    }
    ,
    StringView.putUTF16CharCode = function(a, b, c) {
        var d = c;
        return 65536 > b ? a[d++] = b : (a[d++] = 55232 + (b >>> 10),
                a[d++] = 56320 + (1023 & b)),
            d
    }
    ,
    StringView.getUTF16CharLength = function(a) {
        return 65536 > a ? 1 : 2
    }
    ,
    StringView.b64ToUint6 = function(a) {
        return a > 64 && 91 > a ? a - 65 : a > 96 && 123 > a ? a - 71 : a > 47 && 58 > a ? a + 4 : 43 === a ? 62 : 47 === a ? 63 : 0
    }
    ,
    StringView.uint6ToB64 = function(a) {
        return 26 > a ? a + 65 : 52 > a ? a + 71 : 62 > a ? a - 4 : 62 === a ? 43 : 63 === a ? 47 : 65
    }
    ,
    StringView.bytesToBase64 = function(a) {
        for (var b, c = "", d = a.length, e = 0, f = 0; d > f; f++)
            b = f % 3,
            f > 0 && 4 * f / 3 % 76 === 0 && (c += "\r\n"),
                e |= a[f] << (16 >>> b & 24),
            (2 === b || a.length - f === 1) && (c += String.fromCharCode(StringView.uint6ToB64(e >>> 18 & 63), StringView.uint6ToB64(e >>> 12 & 63), StringView.uint6ToB64(e >>> 6 & 63), StringView.uint6ToB64(63 & e)),
                e = 0);
        return c.replace(/A(?=A$|$)/g, "=")
    }
    ,
    StringView.base64ToBytes = function(a, b) {
        for (var c, d, e = a.replace(/[^A-Za-z0-9\+\/]/g, ""), f = e.length, g = b ? Math.ceil((3 * f + 1 >>> 2) / b) * b : 3 * f + 1 >>> 2, h = new Uint8Array(g), i = 0, j = 0, k = 0; f > k; k++)
            if (d = 3 & k,
                    i |= StringView.b64ToUint6(e.charCodeAt(k)) << 18 - 6 * d,
                3 === d || f - k === 1) {
                for (c = 0; 3 > c && g > j; c++,
                    j++)
                    h[j] = i >>> (16 >>> c & 24) & 255;
                i = 0
            }
        return h
    }
    ,
    StringView.makeFromBase64 = function(a, b, c, d) {
        return new StringView("UTF-16" === b || "UTF-32" === b ? StringView.base64ToBytes(a, "UTF-16" === b ? 2 : 4).buffer : StringView.base64ToBytes(a),b,c,d)
    }
    ,
    StringView.prototype.encoding = "UTF-8",
    StringView.prototype.makeIndex = function(a, b) {
        var c, d = this.rawData, e = d.length, f = b || 0, g = f, h = isNaN(a) ? 1 / 0 : a;
        if (a + 1 > d.length)
            throw new RangeError("StringView.prototype.makeIndex - The offset can't be major than the length of the array - 1.");
        switch (this.encoding) {
            case "UTF-8":
                var i;
                for (c = 0; e > g && h > c; c++)
                    i = d[g],
                        g += i > 251 && 254 > i && e > g + 5 ? 6 : i > 247 && 252 > i && e > g + 4 ? 5 : i > 239 && 248 > i && e > g + 3 ? 4 : i > 223 && 240 > i && e > g + 2 ? 3 : i > 191 && 224 > i && e > g + 1 ? 2 : 1;
                break;
            case "UTF-16":
                for (c = f; e > g && h > c; c++)
                    g += d[g] > 55231 && g + 1 < d.length ? 2 : 1;
                break;
            default:
                g = c = isFinite(a) ? a : e - 1
        }
        return a ? g : c
    }
    ,
    StringView.prototype.toBase64 = function(a) {
        return StringView.bytesToBase64(a ? this.bufferView.constructor === Uint8Array ? this.bufferView : new Uint8Array(this.buffer) : this.rawData.constructor === Uint8Array ? this.rawData : new Uint8Array(this.buffer,this.rawData.byteOffset,this.rawData.length << (this.rawData.constructor === Uint16Array ? 1 : 2)))
    }
    ,
    StringView.prototype.subview = function(a, b) {
        var c, d, e, f, g = "UTF-8" === this.encoding || "UTF-16" === this.encoding, h = a, i = this.rawData.length;
        return 0 === i ? new StringView(this.buffer,this.encoding) : (f = g ? this.makeIndex() : i,
                d = a ? Math.max((f + a) % f, 0) : 0,
                e = Number.isInteger(b) ? Math.max(b, 0) + d > f ? f - d : b : f,
                0 === d && e === f ? this : (g ? (h = this.makeIndex(d),
                            c = this.makeIndex(e, h) - h) : (h = d,
                            c = e - d),
                        "UTF-16" === this.encoding ? h <<= 1 : "UTF-32" === this.encoding && (h <<= 2),
                        new StringView(this.buffer,this.encoding,h,c)))
    }
    ,
    StringView.prototype.forEachChar = function(a, b, c, d) {
        var e, f, g = this.rawData;
        if ("UTF-8" === this.encoding || "UTF-16" === this.encoding) {
            var h, i;
            "UTF-8" === this.encoding ? (h = StringView.getUTF8CharLength,
                    i = StringView.loadUTF8CharCode) : "UTF-16" === this.encoding && (h = StringView.getUTF16CharLength,
                    i = StringView.loadUTF16CharCode),
                f = isFinite(c) ? this.makeIndex(c) : 0,
                e = isFinite(d) ? this.makeIndex(d, f) : g.length;
            for (var j, k = 0; e > f; k++)
                j = i(g, f),
                    a.call(b || null, j, k, f, g),
                    f += h(j)
        } else
            for (f = isFinite(c) ? c : 0,
                     e = isFinite(d) ? d + f : g.length,
                     f; e > f; f++)
                a.call(b || null, g[f], f, f, g)
    }
    ,
    StringView.prototype.valueOf = StringView.prototype.toString = function() {
        if ("UTF-8" !== this.encoding && "UTF-16" !== this.encoding)
            return String.fromCharCode.apply(null, this.rawData);
        var a, b, c = "";
        "UTF-8" === this.encoding ? (b = StringView.getUTF8CharLength,
                a = StringView.loadUTF8CharCode) : "UTF-16" === this.encoding && (b = StringView.getUTF16CharLength,
                a = StringView.loadUTF16CharCode);
        for (var d, e = this.rawData.length, f = 0; e > f; f += b(d))
            d = a(this.rawData, f),
                c += String.fromCharCode(d);
        return c
    }
;