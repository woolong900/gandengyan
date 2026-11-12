"use strict";
// Local rooms are created before their scene exists. Keep the deal pending until
// the native animation component is mounted; never substitute a wall-clock delay.
function tryPlay(room) {
var pending = room._pendingDeal, view = room._dealView;
if (!pending || !view || pending.started || !room.isActive()) return;
pending.started = true;
// Hide stale/fully laid-out cards before the next frame, including scene start.
if (view.myCardsPointer) {
view.myCardsPointer._dealing = true;
view.myCardsPointer.hideAll();
}
if (view.ctrRoot) view.ctrRoot.active = false;
if (view.clockRoot) view.clockRoot.active = false;
view.scheduleOnce(function() {
if (room._pendingDeal !== pending || room._dealView !== view || !room.isActive() || room._roundToken !== pending.token) return;
view.play(function() {
if (room._pendingDeal !== pending || room._dealView !== view || !room.isActive() || room._roundToken !== pending.token) return;
room._pendingDeal = null;
pending.complete();
});
}, 0);
}
exports.begin = function(room, complete) {
room._pendingDeal = {token: room._roundToken, complete: complete, started: false};
tryPlay(room);
};
exports.attach = function(room, view) {
room._dealView = view;
tryPlay(room);
};
exports.detach = function(room, view) {
if (room._dealView !== view) return;
room._dealView = null;
if (room._pendingDeal) room._pendingDeal.started = false;
};
exports.cancel = function(room) { room._pendingDeal = null; };
