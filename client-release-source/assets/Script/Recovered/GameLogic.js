// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "3f8c2S8j6ZHB4bSbOCkr4R3", "GameLogic");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./CommonEnum"), r = require("./GameLogicMJ_QJHH"), i = require("./GameLogicMJ_HZHH"), a = require("./GameLogicMJ_HZHZ"), s = require("./GameLogicMJ_LTMJ"), l = require("./GameLogicMJ_XSMJ"), c = require("./GameLogicMJ_QCHZ"), u = require("./GameLogicMJ_QCHH"), d = require("./GameLogicD7_XS"), p = require("./GameLogicMJ_MCHZ"), f = require("./GameLogicMJ_QCGD"), h = require("./GameLogicMJ_HMMJ"), m = require("./GameLogicMJ_YJLY"), y = require("./GameLogicPDK_AA"), g = require("./GameLogicMJ_TMHH"), _ = require("./GameLogicWSK_QCDG"), v = require("./GameLogicWSK_QJSHZ"), C = require("./GameLogicWSK_QJWSKBD"), b = require("./GameLogicMJ_QJHZ"), D = require("./GameLogicMJ_DYKKF"), S = require("./GameLogicMJ_DYHH"), w = require("./GameLogicDBD_HG"), O = require("./GameLogicWSK_XSWSK"), P = require("./GameLogicDDZ"), I = function() {
function e() {}
e.getInstance = function(e) {
var t = null;
e === n.eGameIds.QJHH && (t = r.default.getInstance());
e === n.eGameIds.QJHZ && (t = b.default.getInstance());
e === n.eGameIds.HZHH && (t = i.default.getInstance());
e === n.eGameIds.HZHZ && (t = a.default.getInstance());
e === n.eGameIds.LTMJ && (t = s.default.getInstance());
e === n.eGameIds.XSMJ && (t = l.default.getInstance());
e === n.eGameIds.QCHZ && (t = c.default.getInstance());
e === n.eGameIds.QCHH && (t = u.default.getInstance());
e === n.eGameIds.D7XS && (t = d.default.getInstance());
e === n.eGameIds.MCHZ && (t = p.default.getInstance());
e === n.eGameIds.QCGD && (t = f.default.getInstance());
e === n.eGameIds.HMMJ && (t = h.default.getInstance());
e === n.eGameIds.YJLY && (t = m.default.getInstance());
e === n.eGameIds.PDKAA && (t = y.default.getInstance());
e === n.eGameIds.TMHH && (t = g.default.getInstance());
e === n.eGameIds.QCDG && (t = _.default.getInstance());
e === n.eGameIds.QJSHZ && (t = v.default.getInstance());
e === n.eGameIds.QJWSKBD && (t = C.default.getInstance());
e === n.eGameIds.DYKKF && (t = D.default.getInstance());
e === n.eGameIds.DYHH && (t = S.default.getInstance());
e === n.eGameIds.DBDAA && (t = w.default.getInstance());
e === n.eGameIds.XSWSK && (t = O.default.getInstance());
e === n.eGameIds.DDZ && (t = P.default.getInstance());
null == t && cc.error("GameLogicDDZ.getInstance = null:");
return t;
};
return e;
}();
o.default = I;
cc._RF.pop();
