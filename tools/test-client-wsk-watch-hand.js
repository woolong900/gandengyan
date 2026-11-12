#!/usr/bin/env node
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'client-release-source', 'assets', 'Script', 'Recovered');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const analysis = read('AnalysisMsgWSK.js');
const messages = read('GameMsgWSK.js');
const control = read('WSKGameControl.js');
const watcher = read('WatcherViewCtr.js');
const playerInfo = read('WSKPosPlayerInfoCtr.js');
const msgBox = read('MsgBox.js');
const sortButton = read('WSKMyBtnSortCtr.js');
const gameInfo = read('WSKGameInfoData.js');
const roomInfo = read('RoomInfoData.js');

assert(messages.includes('msghead: "wsk_watch_view"')
  && messages.includes('msghead: "wsk_watch_hand_request"')
  && messages.includes('msghead: "wsk_watch_hand_reply"'),
'说胡子客户端缺少切换视角或看牌申请协议');
assert(messages.includes('msghead: "wsk_hand_sort"')
  && sortButton.includes('syncHandSort(require("./Storage").default.wskHandCardsSortType.getValue())'),
'玩家整理手牌时没有向服务端同步当前牌序');
assert(analysis.includes('"wsk_hand_sort" === t && this._handSort(o);')
  && analysis.includes('handSortType: null != m.hand_sort_type')
  && gameInfo.includes('null != i.handSortType && c.sortCards')
  && roomInfo.includes('if (!this.isWatcher()) {'),
'观战端没有按目标玩家的实际牌序显示手牌');
assert(messages.includes('e.res.what || "暂时无法查看手牌"')
  && messages.includes('网络请求失败，请稍后重试～'),
'观战看牌被距离校验拒绝时必须向玩家显示明确原因');
assert(analysis.includes('申请查看您的手牌，是否同意？')
  && analysis.includes('replyWatchHand(o, n, !0)')
  && analysis.includes('replyWatchHand(o, n, !1)'),
'被查看玩家没有同意/拒绝弹窗');
assert(analysis.includes('null != e.watch_pos')
  && watcher.includes('getInstance().watchView'),
'说胡子观战切换没有同步到服务端');
assert(playerInfo.includes('a.default.data_game_watch_pos_change'),
'切换说胡子观战视角后必须刷新玩家昵称与头像');
const gameInfoStart = analysis.indexOf('t.prototype._gameInfo = function');
const watchViewStart = analysis.indexOf('t.prototype._watchView = function');
const parsePlayerStart = analysis.indexOf('t.prototype._parsePlayer = function');
assert(gameInfoStart >= 0 && watchViewStart > gameInfoStart && parsePlayerStart > watchViewStart,
'看牌消息处理方法位置异常');
const gameInfoBody = analysis.slice(gameInfoStart, watchViewStart);
assert(gameInfoBody.includes('c.default.updateGameData(D);')
  && !gameInfoBody.includes('prototype._watchView'),
'看牌消息处理方法不能嵌套在 _gameInfo 中');
assert(control.includes('WSKWatchView')
  && control.includes('WSKWatchHandRequest')
  && control.includes('cc.v2(570, -220)'),
'说胡子场景没有生成切换视角按钮或查看手牌按钮');
assert(control.includes('t = "Hall/Res/Texture/Game/icon_watch"')
  && control.includes('new cc.Node("WatcherViewLayer")')
  && control.includes('}, e._watchViewRoot);'),
'说胡子切换视角按钮应复用干瞪眼的原生摄像机图标与布局');
assert(control.includes('offset: 3,\nx: -330,\ny: 60')
  && control.includes('offset: 1,\nx: 330,\ny: 60'),
'说胡子左侧玩家必须对应相对座位 3、右侧玩家必须对应相对座位 1');
assert(control.includes('this._findWatchNode(this.node, "BtnWatch")')
  && control.includes('i && i.spriteFrame ? i.spriteFrame')
  && !control.includes('ClosedEyeGlyph')
  && !control.includes('WatchHandLabel')
  && !control.includes('this._drawClosedEye(this._watchHandButton);'),
'查看手牌按钮必须直接使用查看观看者的原图，不能叠加闭眼横线或文字');
assert(control.includes('t.prototype._findWatchNode = function(e, t) {')
  && control.includes('this._findWatchNode(this.node, "BtnWatch")'),
'查看观看者按钮应递归查找，不能依赖错误的固定层级');
assert(!control.includes('instanceof cc.SpriteFrame')
  && !control.includes('o.addComponent(cc.Graphics)'),
'观战按钮不能使用旧客户端不稳定的 SpriteFrame instanceof 或 Graphics 绘制');
const startBodyStart = control.indexOf('t.prototype.start = function() {');
const startBodyEnd = control.indexOf('t.prototype._findWatchNode = function');
const startBody = control.slice(startBodyStart, startBodyEnd);
assert(startBody.indexOf('data_room_destroyed') >= 0
  && startBody.indexOf('data_room_destroyed') < startBody.indexOf('this._installWatchControls();')
  && startBody.includes('WSK watch controls install failed'),
'观战退出监听必须先于按钮初始化注册，且按钮失败不能中断场景初始化');
assert(control.includes('this._watchHandButton.active = !!(l.default.isWatcher() && e')
  && !control.includes('e.status === m.eWSKGameStatus.Gameing'),
'观战看牌按钮不应依赖容易滞后的牌局状态枚举');
assert(msgBox.includes('var o = i.default.isWatcher();')
  && msgBox.includes('0 === e.error ? o && i.default.leaveRoom(!1)')
  && !msgBox.includes('o && i.default.isInRoom() && i.default.leaveRoom()'),
'观战退出成功后客户端应主动离开残留牌桌页面');

console.log('说胡子客户端观战切换与看牌申请测试通过');
