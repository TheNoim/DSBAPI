const pako = require('pako');
const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function btoa(b) {
    let c, d, e = "";
    for (c = 0,
             d = b.length; d > c; c += 3) {
        const f = 255 & b.charCodeAt(c)
            , g = 255 & b.charCodeAt(c + 1)
            , h = 255 & b.charCodeAt(c + 2)
            , i = f >> 2
            , j = (3 & f) << 4 | g >> 4
            , k = d > c + 1 ? (15 & g) << 2 | h >> 6 : 64
            , l = d > c + 2 ? 63 & h : 64;
        e += a.charAt(i) + a.charAt(j) + a.charAt(k) + a.charAt(l)
    }
    return e
}
function atob(a) {
    for (var b, c, d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e = String(a).replace(/=+$/, ""), f = 0, g = 0, h = ""; c = e.charAt(g++); ~c && (b = f % 4 ? 64 * b + c : c,
    f++ % 4) ? h += String.fromCharCode(255 & b >> (-2 * f & 6)) : 0)
        c = d.indexOf(c);
    return h
}

module.exports = function (ObjectToEncode) {
    let b = pako.deflate(JSON.stringify(ObjectToEncode), {
        to: "string",
        gzip: !0
    });
    return b = btoa(b);
};