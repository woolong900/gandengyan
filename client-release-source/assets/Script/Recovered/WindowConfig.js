// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "65ddbhKXtVKeKxQA5Iik6C8", "WindowConfig");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n, r, i, a, s;
(function(e) {
e[e.COMMON = 1] = "COMMON";
e[e.LOADING = 2] = "LOADING";
e[e.NET_ERROR = 3] = "NET_ERROR";
})(n = o.eWindowType || (o.eWindowType = {}));
(function(e) {
e[e.NOTHING = 0] = "NOTHING";
e[e.DEFAULT = 1] = "DEFAULT";
})(r = o.eWindowAnimateShow || (o.eWindowAnimateShow = {}));
(function(e) {
e[e.NOTHING = 0] = "NOTHING";
e[e.DEFAULT = 1] = "DEFAULT";
})(i = o.eWindowAnimateClose || (o.eWindowAnimateClose = {}));
(function(e) {
e[e.CLOSE = 0] = "CLOSE";
e[e.PASS = 1] = "PASS";
e[e.NOTPASS = 2] = "NOTPASS";
})(a = o.eWindowTouchOutside || (o.eWindowTouchOutside = {}));
(function(e) {
e[e.Loading = 0] = "Loading";
e[e.NetErrorTip = 1] = "NetErrorTip";
e[e.MsgBoxCommon = 2] = "MsgBoxCommon";
e[e.ShareLayer = 3] = "ShareLayer";
e[e.AgreementLayer = 4] = "AgreementLayer";
e[e.AgreementSecLayer = 5] = "AgreementSecLayer";
e[e.MobileLoginLayer = 6] = "MobileLoginLayer";
e[e.NameCertification = 7] = "NameCertification";
e[e.NameCertificationPopUp = 8] = "NameCertificationPopUp";
e[e.NameCertificationOK = 9] = "NameCertificationOK";
e[e.InviteCode = 10] = "InviteCode";
e[e.InviteCodeOK = 11] = "InviteCodeOK";
e[e.JoinRoom = 12] = "JoinRoom";
e[e.CreateRoom = 13] = "CreateRoom";
e[e.Setting = 14] = "Setting";
e[e.ShoppingMall = 15] = "ShoppingMall";
e[e.InstructionLayer = 16] = "InstructionLayer";
e[e.BindMobile = 17] = "BindMobile";
e[e.BindMobileOK = 18] = "BindMobileOK";
e[e.RollerLayer = 19] = "RollerLayer";
e[e.ActivityLayer = 20] = "ActivityLayer";
e[e.RulesLayer = 21] = "RulesLayer";
e[e.UserInfoLayer = 22] = "UserInfoLayer";
e[e.RecordList = 23] = "RecordList";
e[e.ContactLayer = 24] = "ContactLayer";
e[e.ClubLayer = 25] = "ClubLayer";
e[e.InviteMsgLayer = 26] = "InviteMsgLayer";
e[e.RecordCheck = 27] = "RecordCheck";
e[e.RecordDetail = 28] = "RecordDetail";
e[e.RecordGameChoose = 29] = "RecordGameChoose";
e[e.PopActivity = 30] = "PopActivity";
e[e.PayTypeLayer = 31] = "PayTypeLayer";
e[e.ReportLayer = 32] = "ReportLayer";
e[e.GameTableAnimation = 33] = "GameTableAnimation";
e[e.TotalEndLayer = 34] = "TotalEndLayer";
e[e.ChatLayer = 35] = "ChatLayer";
e[e.ChooseChiLayer = 36] = "ChooseChiLayer";
e[e.ChooseGangLayer = 37] = "ChooseGangLayer";
e[e.LocationLayer = 38] = "LocationLayer";
e[e.GiftLayer = 39] = "GiftLayer";
e[e.InvitePlayerLayer = 40] = "InvitePlayerLayer";
e[e.NotJoinClubLayer = 41] = "NotJoinClubLayer";
e[e.CreateClubLayer = 42] = "CreateClubLayer";
e[e.CreateClubTipLayer = 43] = "CreateClubTipLayer";
e[e.ClubPopupBase = 44] = "ClubPopupBase";
e[e.ClubMsgListLayer = 45] = "ClubMsgListLayer";
e[e.AllianceJoinLayer = 46] = "AllianceJoinLayer";
e[e.AllianceManageLayer = 47] = "AllianceManageLayer";
e[e.AllianceClubInviteLayer = 48] = "AllianceClubInviteLayer";
e[e.ClubTableDetailsLayer4 = 49] = "ClubTableDetailsLayer4";
e[e.ClubTableDetailsLayer5 = 50] = "ClubTableDetailsLayer5";
e[e.ClubMemberInfo = 51] = "ClubMemberInfo";
e[e.ClubAuthorityInfo = 52] = "ClubAuthorityInfo";
e[e.ClubGameChoose = 53] = "ClubGameChoose";
e[e.ClubGameSetting = 54] = "ClubGameSetting";
e[e.CardSendLayer = 55] = "CardSendLayer";
e[e.CardSendWindowLayer = 56] = "CardSendWindowLayer";
e[e.ClubAdjustPlzLayer = 57] = "ClubAdjustPlzLayer";
e[e.ClubHistoryOfPlz = 58] = "ClubHistoryOfPlz";
e[e.ClubAdjustPlzCalcLayer = 59] = "ClubAdjustPlzCalcLayer";
e[e.ClubFcmSettingLayer = 60] = "ClubFcmSettingLayer";
e[e.ClubDetailsLayer = 61] = "ClubDetailsLayer";
e[e.ClubTableSchemeLayer = 62] = "ClubTableSchemeLayer";
e[e.AddMemberLayer = 63] = "AddMemberLayer";
e[e.ClubMemberManageLayer = 64] = "ClubMemberManageLayer";
e[e.ClubRecordDetailLayer = 65] = "ClubRecordDetailLayer";
e[e.ClubInviteTipLayer = 66] = "ClubInviteTipLayer";
e[e.MsgBoxLayer = 67] = "MsgBoxLayer";
e[e.ClubRenameLayer = 68] = "ClubRenameLayer";
e[e.ClubManageLayer = 69] = "ClubManageLayer";
e[e.ClubFillNumber = 70] = "ClubFillNumber";
e[e.ClubMyRecordLayer = 71] = "ClubMyRecordLayer";
})(s = o.eWindowID || (o.eWindowID = {}));
var l = {};
function c(e, t, o, n, r, i, a, s) {
l[e] = {
id: e,
url: t,
type: o,
outside: n,
animateShow: r,
animateClose: i,
singleton: a,
shadow: s
};
}
function u(e, t, o, s, l, u) {
void 0 === o && (o = a.NOTPASS);
void 0 === s && (s = r.DEFAULT);
void 0 === l && (l = !0);
void 0 === u && (u = !0);
c(e, t, n.COMMON, o, s, i.NOTHING, l, u);
}
c(s.NetErrorTip, "", n.NET_ERROR, a.NOTPASS, r.DEFAULT, i.NOTHING, !0, !0);
c(s.Loading, "", n.LOADING, a.NOTPASS, r.NOTHING, i.NOTHING, !0, !1);
u(s.MsgBoxCommon, "Hall/Res/Prefab/MsgBox/MsgBoxCommon");
u(s.ShareLayer, "Hall/Res/Prefab/Share/ShareLayer", a.CLOSE, r.NOTHING);
u(s.AgreementLayer, "Hall/Res/Prefab/Login/AgreementLayer");
u(s.AgreementSecLayer, "Hall/Res/Prefab/Login/AgreementSecLayer");
u(s.MobileLoginLayer, "Hall/Res/Prefab/Login/MobileLoginLayer");
u(s.ReportLayer, "Hall/Res/Prefab/Center/ReportLayer", a.CLOSE);
u(s.NameCertification, "Hall/Res/Prefab/Center/NameCertificationLayer");
u(s.NameCertificationPopUp, "Hall/Res/Prefab/Center/NameCertificationPopUpLayer");
u(s.NameCertificationOK, "Hall/Res/Prefab/Center/NameCertificationSuccess", a.CLOSE);
u(s.InviteCode, "Hall/Res/Prefab/Center/InviteCodeLayer");
u(s.InviteCodeOK, "Hall/Res/Prefab/Center/InviteCodeSuccess", a.CLOSE);
u(s.JoinRoom, "Hall/Res/Prefab/Center/JoinLayer", a.CLOSE);
u(s.CreateRoom, "Hall/Res/Prefab/Center/CreateRoom/CreateRoomLayer", a.NOTPASS, r.NOTHING);
u(s.Setting, "Hall/Res/Prefab/Center/SettingLayer");
u(s.ShoppingMall, "Hall/Res/Prefab/Center/ShoppingMall", a.CLOSE, r.NOTHING);
u(s.InstructionLayer, "Hall/Res/Prefab/Center/InstructionLayer", a.NOTPASS, r.NOTHING);
u(s.BindMobile, "Hall/Res/Prefab/Center/BindMobileLayer");
u(s.BindMobileOK, "Hall/Res/Prefab/Center/BindMobileSuccess", a.CLOSE);
u(s.RollerLayer, "Hall/Res/Prefab/Center/RollerLayer", a.CLOSE);
u(s.ActivityLayer, "Hall/Res/Prefab/Center/ActivityLayer", a.NOTPASS, r.NOTHING);
u(s.RulesLayer, "Hall/Res/Prefab/Center/RulesLayer", a.NOTPASS, r.NOTHING);
u(s.UserInfoLayer, "Hall/Res/Prefab/Center/UserInfoLayer");
u(s.RecordList, "Hall/Res/Prefab/Center/Records/RecordList", a.CLOSE, r.NOTHING);
u(s.ContactLayer, "Hall/Res/Prefab/Center/ContactLayer");
u(s.ClubLayer, "Hall/Res/Prefab/Club/ClubLayer", a.NOTPASS, r.NOTHING);
u(s.InviteMsgLayer, "Hall/Res/Prefab/Center/InviteMsgLayer", a.NOTPASS);
u(s.RecordCheck, "Hall/Res/Prefab/Center/Records/RecordCheck", a.CLOSE);
u(s.RecordDetail, "Hall/Res/Prefab/Center/Records/RecordDetail", a.NOTPASS, r.NOTHING);
u(s.RecordGameChoose, "Hall/Res/Prefab/Center/Records/RecordGameChoose", a.CLOSE);
u(s.PopActivity, "Hall/Res/Prefab/Center/PopActivityLayer", a.NOTPASS);
u(s.PayTypeLayer, "Hall/Res/Prefab/Center/PayTypeLayer", a.CLOSE);
u(s.GameTableAnimation, "Hall/Res/Prefab/Game/Animate/TableAnimate", a.NOTPASS, r.NOTHING);
u(s.TotalEndLayer, "Hall/Res/Prefab/Game/Settlement/TotalEndLayer", a.NOTPASS, r.NOTHING);
u(s.ChatLayer, "Hall/Res/Prefab/Game/Chat/ChatLayer", a.CLOSE, r.NOTHING, !0, !1);
u(s.ChooseChiLayer, "Hall/Res/Prefab/Game/ChooseChiLayer", a.CLOSE, r.NOTHING);
u(s.ChooseGangLayer, "Hall/Res/Prefab/Game/ChooseGangLayer", a.CLOSE, r.NOTHING);
u(s.LocationLayer, "Hall/Res/Prefab/Game/Location/LocationLayer", a.CLOSE);
u(s.GiftLayer, "Hall/Res/Prefab/Game/GiftLayer", a.CLOSE);
u(s.InvitePlayerLayer, "Hall/Res/Prefab/Game/Invite/InvitePlayerLayer", a.CLOSE);
u(s.NotJoinClubLayer, "Hall/Res/Prefab/Club/NotJoinClubLayer", a.NOTPASS, r.NOTHING);
u(s.CreateClubLayer, "Hall/Res/Prefab/Club/CreateClubLayer");
u(s.ClubPopupBase, "Hall/Res/Prefab/Club/Popup/ClubPopupBase", a.NOTPASS, r.NOTHING);
u(s.ClubMsgListLayer, "Hall/Res/Prefab/Club/ClubMsgListLayer", a.CLOSE, r.NOTHING);
u(s.AllianceJoinLayer, "Hall/Res/Prefab/Club/Alliance/AllianceJoinLayer", a.CLOSE, r.NOTHING);
u(s.AllianceManageLayer, "Hall/Res/Prefab/Club/Alliance/AllianceManageLayer", a.CLOSE, r.NOTHING);
u(s.AllianceClubInviteLayer, "Hall/Res/Prefab/Club/Alliance/AllianceClubInviteLayer", a.CLOSE);
u(s.ClubTableDetailsLayer4, "Hall/Res/Prefab/Club/ClubTableDetailsLayer4", a.CLOSE);
u(s.ClubTableDetailsLayer5, "Hall/Res/Prefab/Club/ClubTableDetailsLayer5", a.CLOSE);
u(s.ClubMemberInfo, "Hall/Res/Prefab/Club/CommonList/ClubMemberInfo", a.CLOSE, r.NOTHING);
u(s.ClubAuthorityInfo, "Hall/Res/Prefab/Club/CommonList/ClubAuthorityInfo", a.CLOSE, r.NOTHING);
u(s.ClubGameChoose, "Hall/Res/Prefab/Club/GameChooseLayer", a.CLOSE, r.NOTHING);
u(s.ClubGameSetting, "Hall/Res/Prefab/Club/GameSettingLayer", a.CLOSE, r.NOTHING);
u(s.CardSendLayer, "Hall/Res/Prefab/Club/ClubGiftSendLayer", a.CLOSE, r.NOTHING);
u(s.CardSendWindowLayer, "Hall/Res/Prefab/Club/ClubSendCardWindowLayer", a.CLOSE, r.NOTHING);
u(s.ClubAdjustPlzLayer, "/Hall/Res/Prefab/Club/AdjustPlzLayer", a.CLOSE, r.NOTHING);
u(s.ClubHistoryOfPlz, "/Hall/Res/Prefab/Club/ClubAddictDetailLayer", a.CLOSE, r.NOTHING);
u(s.ClubAdjustPlzCalcLayer, "/Hall/Res/Prefab/Club/AdjustPlzCalcLayer", a.CLOSE, r.NOTHING);
u(s.ClubFcmSettingLayer, "/Hall/Res/Prefab/Club/AddictSettingLayer", a.CLOSE, r.NOTHING);
u(s.ClubDetailsLayer, "Hall/Res/Prefab/Club/ClubDetailsLayer", a.CLOSE);
u(s.ClubTableSchemeLayer, "Hall/Res/Prefab/Club/ClubTableSchemeLayer", a.CLOSE, r.NOTHING);
u(s.AddMemberLayer, "Hall/Res/Prefab/Club/AddMemberLayer", a.CLOSE);
u(s.ClubMemberManageLayer, "Hall/Res/Prefab/Club/ClubMemberManageLayer", a.CLOSE, r.NOTHING);
u(s.ClubMyRecordLayer, "Hall/Res/Prefab/Club/ClubCommon/ClubMyRecordList");
u(s.ClubRecordDetailLayer, "Hall/Res/Prefab/Club/ClubCommon/ClubRecordDetailLayer", a.CLOSE, r.NOTHING);
u(s.CreateClubTipLayer, "Hall/Res/Prefab/Club/CreateClubTipLayer");
u(s.MsgBoxLayer, "Hall/Res/Prefab/Club/MsgBoxLayer");
u(s.ClubInviteTipLayer, "Hall/Res/Prefab/Club/InviteGame/InviteTipLayer", a.NOTPASS, r.NOTHING);
u(s.ClubRenameLayer, "Hall/Res/Prefab/Club/Manage/ClubRenameLayer", a.CLOSE);
u(s.ClubManageLayer, "Hall/Res/Prefab/Club/Manage/ClubManageLayer", a.NOTPASS, r.NOTHING);
u(s.ClubFillNumber, "Hall/Res/Prefab/Club/ClubFillNumber", a.CLOSE);
o.default = l;
cc._RF.pop();
