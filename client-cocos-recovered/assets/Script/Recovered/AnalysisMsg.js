// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "aa685b0qV5FHaodNf705tyn", "AnalysisMsg");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("./CommonEnum"), r = e("./AnalysisMsgMJ"), i = e("./AnalysisMsgD7"), a = e("./AnalysisMsgPDK"), s = e("./AnalysisMsgWSK"), l = e("./AnalysisMsgDBD"), c = e("./AnalysisMsgDDZ"), u = function() {
function e() {}
e.getInstance = function(e) {
if (e === n.eGameCategort.MJ) {
this._mj || (this._mj = new r.default());
return this._mj;
}
if (e === n.eGameCategort.D7) {
this._d7 || (this._d7 = new i.default());
return this._d7;
}
if (e === n.eGameCategort.PDK) {
this._pdk || (this._pdk = new a.default());
return this._pdk;
}
if (e === n.eGameCategort.WSK) {
this._wsk || (this._wsk = new s.default());
return this._wsk;
}
if (e === n.eGameCategort.DBD) {
this._dbd || (this._dbd = new l.default());
return this._dbd;
}
if (e === n.eGameCategort.DDZ) {
this._ddz || (this._ddz = new c.default());
return this._ddz;
}
};
e._mj = null;
e._d7 = null;
e._pdk = null;
e._wsk = null;
e._dbd = null;
e._ddz = null;
return e;
}();
o.default = u;
cc._RF.pop();
