// Recovered from the production CommonJS bundle.
var e = require, t = module, o = exports;
"use strict";
cc._RF.push(t, "04f59yF5xpPpqHMrsWX4VH+", "protocol");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = require("./pb");
o.protocol = {
99: {
cs: null,
sc: n.pb.SCPing
},
100: {
cs: n.pb.CSLogin,
sc: n.pb.SCLogin
},
101: {
cs: null,
sc: n.pb.SCIdVerifyInfo
},
102: {
cs: n.pb.CSIdVerify,
sc: n.pb.SCIdVerify
},
103: {
cs: null,
sc: n.pb.SCBindInviteCodeInfo
},
104: {
cs: n.pb.CSBindInviteCode,
sc: n.pb.SCBindInviteCode
},
105: {
cs: null,
sc: n.pb.SCBindMobileInfo
},
106: {
cs: n.pb.CSGetVerificationCode,
sc: n.pb.SCGetVerificationCode
},
107: {
cs: n.pb.CSBindMobile,
sc: n.pb.SCBindMobile
},
108: {
cs: n.pb.CSAgentApply,
sc: n.pb.SCAgentApply
},
109: {
cs: null,
sc: n.pb.SCPaymentQrCodeInfo
},
110: {
cs: n.pb.CSPaymentQrCodeEdit,
sc: n.pb.SCPaymentQrCodeEdit
},
111: {
cs: null,
sc: n.pb.SCShare
},
112: {
cs: n.pb.CSCardGoods,
sc: n.pb.SCCardGoods
},
113: {
cs: n.pb.CSClubList,
sc: n.pb.SCClubList
},
114: {
cs: n.pb.CSClubOwnerInfo,
sc: n.pb.SCClubOwnerInfo
},
115: {
cs: n.pb.CSClubQuit,
sc: n.pb.SCClubQuit
},
116: {
cs: null,
sc: n.pb.SCClubLeave
},
117: {
cs: n.pb.CSClubApply,
sc: n.pb.SCClubApply
},
118: {
cs: n.pb.CSClubInviteList,
sc: n.pb.SCClubInviteList
},
119: {
cs: n.pb.CSClubInviteAgree,
sc: n.pb.SCClubInviteAgree
},
120: {
cs: n.pb.CSClubInviteIgnore,
sc: n.pb.SCClubInviteIgnore
},
121: {
cs: n.pb.CSClubMemberList,
sc: n.pb.SCClubMemberList
},
122: {
cs: n.pb.CSClubRoomList,
sc: n.pb.SCClubRoomList
},
123: {
cs: n.pb.CSClubRoomClose,
sc: n.pb.SCClubRoomClose
},
124: {
cs: n.pb.CSClubGameSchemeList,
sc: n.pb.SCClubGameSchemeList
},
125: {
cs: n.pb.CSGameRecord,
sc: n.pb.SCGameRecord
},
126: {
cs: n.pb.CSGameRecordDetail,
sc: n.pb.SCGameRecordDetail
},
127: {
cs: n.pb.CSGameRecordPlayback,
sc: n.pb.SCGameRecordPlayback
},
128: {
cs: n.pb.CSClubIsolateList,
sc: n.pb.SCClubIsolateList
},
129: {
cs: n.pb.CSClubIsolateGroupAdd,
sc: n.pb.SCClubIsolateGroupAdd
},
130: {
cs: n.pb.CSClubIsolateGroupDel,
sc: n.pb.SCClubIsolateGroupDel
},
131: {
cs: n.pb.CSClubIsolateAdd,
sc: n.pb.SCClubIsolateAdd
},
132: {
cs: n.pb.CSClubIsolateDel,
sc: n.pb.SCClubIsolateDel
},
133: {
cs: n.pb.CSClubMemberFreeze,
sc: n.pb.SCClubMemberFreeze
},
134: {
cs: n.pb.CSClubMemberRemark,
sc: n.pb.SCClubMemberRemark
},
135: {
cs: n.pb.CSClubMemberSetRole,
sc: n.pb.SCClubMemberSetRole
},
136: {
cs: n.pb.CSClubMemberKickOut,
sc: n.pb.SCClubMemberKickOut
},
137: {
cs: n.pb.CSClubApplyList,
sc: n.pb.SCClubApplyList
},
138: {
cs: n.pb.CSClubApplyAgree,
sc: n.pb.SCClubApplyAgree
},
139: {
cs: n.pb.CSClubApplyReject,
sc: n.pb.SCClubApplyReject
},
140: {
cs: n.pb.CSClubApplyInviteUserSearch,
sc: n.pb.SCClubApplyInviteUserSearch
},
141: {
cs: n.pb.CSClubApplyInvite,
sc: n.pb.SCClubApplyInvite
},
142: {
cs: n.pb.CSClubQuitRecordList,
sc: n.pb.SCClubQuitRecordList
},
143: {
cs: n.pb.CSClubApplyInviteSubUserList,
sc: n.pb.SCClubApplyInviteSubUserList
},
144: {
cs: n.pb.CSClubApplyInviteSubUser,
sc: n.pb.SCClubApplyInviteSubUser
},
145: {
cs: n.pb.CSClubEdit,
sc: n.pb.SCClubEdit
},
146: {
cs: n.pb.CSClubRecordStatisticsDayList,
sc: n.pb.SCClubRecordStatisticsDayList
},
147: {
cs: n.pb.CSClubCreate,
sc: n.pb.SCClubCreate
},
148: {
cs: n.pb.CSClubDepositCard,
sc: n.pb.SCClubDepositCard
},
149: {
cs: n.pb.CSClubGameSchemeAdd,
sc: n.pb.SCClubGameSchemeAdd
},
150: {
cs: n.pb.CSClubGameSchemeEdit,
sc: n.pb.SCClubGameSchemeEdit
},
151: {
cs: n.pb.CSClubGameSchemeAuto,
sc: n.pb.SCClubGameSchemeAuto
},
152: {
cs: n.pb.CSClubGameSchemeDelete,
sc: n.pb.SCClubGameSchemeDelete
},
153: {
cs: null,
sc: n.pb.SCWithAgentInfo
},
154: {
cs: n.pb.CSClubRoomInviteList,
sc: n.pb.SCClubRoomInviteList
},
155: {
cs: n.pb.CSClubRoomInvite,
sc: n.pb.SCClubRoomInvite
},
156: {
cs: n.pb.CSClubRoomInviteReject,
sc: n.pb.SCClubRoomInviteReject
},
157: {
cs: n.pb.CSClubRoomKickout,
sc: n.pb.SCClubRoomKickout
},
158: {
cs: n.pb.CSClubDismiss,
sc: n.pb.SCClubDismiss
},
159: {
cs: n.pb.CSSetUserSex,
sc: n.pb.SCSetUserSex
},
160: {
cs: n.pb.CSClubEditFatigueVal,
sc: n.pb.SCClubEditFatigueVal
},
161: {
cs: n.pb.CSClubMemberAntiAddictionList,
sc: n.pb.SCClubMemberAntiAddictionList
},
162: {
cs: n.pb.CSClubMemberReleaseProhibited,
sc: n.pb.SCClubMemberReleaseProhibited
},
163: {
cs: n.pb.CSAccumulatedRecordList,
sc: n.pb.SCAccumulatedRecordList
},
164: {
cs: n.pb.CSOpRecordList,
sc: n.pb.SCOpRecordList
},
165: {
cs: n.pb.CSSetUserInfo,
sc: n.pb.SCSetUserInfo
},
166: {
cs: n.pb.CSClubGameUserDayRecordList,
sc: n.pb.SCClubGameUserDayRecordList
},
168: {
cs: null,
sc: null
},
401: {
cs: null,
sc: null
},
1000: {
cs: null,
sc: null
},
1001: {
cs: null,
sc: n.pb.SCUserAccountUpdate
},
1002: {
cs: null,
sc: n.pb.SCClubRoomState
},
1003: {
cs: null,
sc: n.pb.SCRoomClubInvite
},
1005: {
cs: null,
sc: n.pb.SCMarquee
},
1006: {
cs: null,
sc: n.pb.SCArea
},
1007: {
cs: null,
sc: n.pb.SCUserNotice
},
200: {
cs: n.pb.CSGameJson,
sc: n.pb.SCGameJson
},
201: {
cs: n.pb.CSCreateRoom,
sc: n.pb.SCCreateRoom
},
202: {
cs: n.pb.CSJoinRoom,
sc: n.pb.SCJoinRoom
},
999: {
cs: null,
sc: n.pb.ADGameJson
}
};
cc._RF.pop();
