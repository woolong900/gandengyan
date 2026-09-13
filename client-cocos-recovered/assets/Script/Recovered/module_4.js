// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
o.read = function(e, t, o, n, r) {
var i, a, s = 8 * r - n - 1, l = (1 << s) - 1, c = l >> 1, u = -7, d = o ? r - 1 : 0, p = o ? -1 : 1, f = e[t + d];
d += p;
i = f & (1 << -u) - 1;
f >>= -u;
u += s;
for (;u > 0; i = 256 * i + e[t + d], d += p, u -= 8) ;
a = i & (1 << -u) - 1;
i >>= -u;
u += n;
for (;u > 0; a = 256 * a + e[t + d], d += p, u -= 8) ;
if (0 === i) i = 1 - c; else {
if (i === l) return a ? NaN : Infinity * (f ? -1 : 1);
a += Math.pow(2, n);
i -= c;
}
return (f ? -1 : 1) * a * Math.pow(2, i - n);
};
o.write = function(e, t, o, n, r, i) {
var a, s, l, c = 8 * i - r - 1, u = (1 << c) - 1, d = u >> 1, p = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0, f = n ? 0 : i - 1, h = n ? 1 : -1, m = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
t = Math.abs(t);
if (isNaN(t) || Infinity === t) {
s = isNaN(t) ? 1 : 0;
a = u;
} else {
a = Math.floor(Math.log(t) / Math.LN2);
if (t * (l = Math.pow(2, -a)) < 1) {
a--;
l *= 2;
}
if ((t += a + d >= 1 ? p / l : p * Math.pow(2, 1 - d)) * l >= 2) {
a++;
l /= 2;
}
if (a + d >= u) {
s = 0;
a = u;
} else if (a + d >= 1) {
s = (t * l - 1) * Math.pow(2, r);
a += d;
} else {
s = t * Math.pow(2, d - 1) * Math.pow(2, r);
a = 0;
}
}
for (;r >= 8; e[o + f] = 255 & s, f += h, s /= 256, r -= 8) ;
a = a << r | s;
c += r;
for (;c > 0; e[o + f] = 255 & a, f += h, a /= 256, c -= 8) ;
e[o + f - h] |= 128 * m;
};
