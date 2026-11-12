// Share ShuoHuZi action artwork, including waiting-room buttons across games.
"use strict";
var ATLAS = "_RecoveredDependencies/Textures/19c83aa89";
var BUTTON_WIDTH = 226, BUTTON_HEIGHT = 88;
function originalSize(node) {
var sprite = node.getComponent(cc.Sprite);
if (sprite) sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
node.setContentSize(BUTTON_WIDTH, BUTTON_HEIGHT);
}
// Same SpriteFrame rectangles as SceneWSK and 19c83aa89.png.meta.
var FRAMES = {
pass: [467, 97, 226, 88],
tip: [235, 191, 226, 88],
tipDisabled: [3, 66, 226, 88],
put: [458, 3, 226, 88],
putDisabled: [3, 160, 226, 88]
};
exports.apply = function(root) {
root = root && (root.getChildByName("Root") || root);
var operate = root && root.getChildByName("MyOperateRoot");
var actionRoot = operate && (operate.getChildByName("OperateRoot") || operate);
var row = actionRoot && actionRoot.getChildByName("BtnRoot");
if (!row) return;
cc.loader.loadRes(ATLAS, cc.Texture2D, function(error, texture) {
if (error) { cc.error("ShuoHuZi action-button texture failed:", error); return; }
if (!cc.isValid(row)) return;
// Use text-free skins: swapping the baked-in frames would swap their words too.
var kinds = {BtnPass:["put","不出"], BtnPutPass:["put","不出"], BtnTip:["pass","提示"], BtnPut:["tip","出牌"]};
Object.keys(kinds).forEach(function(name) {
var node = row.getChildByName(name);
if (node && cc.isValid(node)) named(node, texture, kinds[name][0], kinds[name][1]);
});
});
};

// Text-free skins use only the untouched edge pixels of the same action atlas.
// The center is a narrow vertical gradient strip, stretched between both edges;
// baked-in "出牌/提示/不出" glyphs are never stretched or covered with another label.
var SkinSync;
function skinComponent() {
if (!SkinSync) SkinSync = cc.Class({
extends: cc.Component,
lateUpdate: function() {
if (!this.button || !this.parts) return;
var enabled = this.button.interactable && this.button.enabled;
var color = enabled ? this.node.color : this.button.disabledColor;
for (var j = 0; j < this.parts.length; j++) this.parts[j].color = color;
// Dim the artwork separately: tinting text like the background leaves dark
// glyphs surrounded by the still-colored outline, especially on green skins.
this.label.node.color = enabled ? color : this.disabledTextColor;
this.outline.color = enabled ? this.normalOutlineColor : this.disabledOutlineColor;
if (this.sourceLabel) this.label.string = this.sourceLabel.string;
// Draw art and text at native resolution; the canvas handles screen fitting.
this.node.setScale(1, 1);
},
onDestroy: function() {
if (this.frames) this.frames.forEach(function(f) { f.destroy(); });
}
});
return SkinSync;
}
function named(node, texture, kind, text) {
if (!node || !cc.isValid(node)) return;
var button = node.getComponent(cc.Button);
if (!button) return;
originalSize(node);
if (node._pokerSkin) {
originalSize(node._pokerSkin.host);
node._pokerSkin.label.string = text;
return;
}
var target = button.target || node;
originalSize(target);
var oldSprite = target.getComponent(cc.Sprite);
if (oldSprite) oldSprite.enabled = false;
var sourceLabel = typeof text === "object" ? text : null;
function hideLabels(n) {
var label = n.getComponent(cc.Label);
if (label) label.enabled = false;
for (var j = 0; j < n.children.length; j++) hideLabels(n.children[j]);
}
hideLabels(target);
var root = new cc.Node("PokerActionSkin");
root.setContentSize(226,88);
root.setPosition((0.5 - target.anchorX) * target.width, (0.5 - target.anchorY) * target.height);
target.addChild(root);
var sync = root.addComponent(skinComponent()), rect = FRAMES[kind];
sync.host = target; sync.button = button; sync.parts = []; sync.frames = [];
// 48-pixel edges keep the original rounded corners, wave motifs and shadow.
[[0,48,-89,48],[48,1,0,130],[178,48,89,48]].forEach(function(piece) {
var part = new cc.Node("SkinPart"), sprite = part.addComponent(cc.Sprite);
var f = new cc.SpriteFrame(texture, cc.rect(rect[0]+piece[0],rect[1],piece[1],88), false,
cc.v2(0,0),cc.size(piece[1],88));
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM; sprite.type = cc.Sprite.Type.SIMPLE;
sprite.spriteFrame = f; part.setContentSize(piece[3],88); part.setPosition(piece[2],0);
root.addChild(part); sync.parts.push(part); sync.frames.push(f);
});
var labelNode = new cc.Node("ActionText"), label = labelNode.addComponent(cc.Label);
label.string = sourceLabel ? sourceLabel.string : text;
label.fontSize = 38; label.lineHeight = 44; label.isBold = true;
label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
label.verticalAlign = cc.Label.VerticalAlign.CENTER;
label.overflow = cc.Label.Overflow.SHRINK;
labelNode.setContentSize(210,72); labelNode.setPosition(0,3);
var outline = labelNode.addComponent(cc.LabelOutline);
outline.color = kind === "pass" ? cc.color(170,124,43,255) :
kind === "tip" ? cc.color(67,125,27,255) : cc.color(155,62,40,255);
outline.width = 2;
sync.outline = outline; sync.normalOutlineColor = outline.color;
sync.disabledTextColor = cc.color(180,180,180,255);
sync.disabledOutlineColor = cc.color(45,45,45,255);
root.addChild(labelNode);
sync.label = label; sync.sourceLabel = sourceLabel; node._pokerSkin = sync;
button.target = root;
button.normalColor = cc.color(255,255,255,255); button.pressedColor = cc.color(220,220,220,255);
button.hoverColor = cc.color(255,255,255,255); button.disabledColor = cc.color(76,76,76,255);
button.transition = cc.Button.Transition.COLOR;
sync.lateUpdate();
}
function loadNamed(controller, specs) {
cc.loader.loadRes(ATLAS, cc.Texture2D, function(error, texture) {
if (error || !cc.isValid(controller.node)) return;
specs.forEach(function(spec) {
var node = typeof spec[0] === "string" ? controller[spec[0]] : spec[0];
named(node, texture, spec[1], typeof spec[2] === "function" ? spec[2]() : spec[2]);
});
});
}
exports.applyBidding = function(controller) {
loadNamed(controller, [
["jiaodizhu","pass","叫地主"],["buJiaodizhu","put","不叫"],
["Redouble","pass","加倍"],["unRedouble","put","不加倍"]
]);
};
exports.applyTribute = function(controller) {
loadNamed(controller, [[controller.jiaodizhu,"put",function() { return controller._tributeText || "进贡"; }]]);
};
exports.updateTribute = function(controller, returning, enabled) {
controller._tributeText = returning ? "还贡" : "进贡";
var node = controller.jiaodizhu, button = node.getComponent(cc.Button);
button.enabled = true;
button.interactable = enabled;
if (node._pokerSkin) {
node._pokerSkin.label.string = controller._tributeText;
node._pokerSkin.lateUpdate();
}
};
function waitingSpecs(controller) {
var specs = [["btnInvite","tip","邀请好友"],
["btnClubInvite","tip","邀请好友"]];
var ready = controller.btnReady;
if (ready && ready.getComponent(cc.Button)) specs.push([ready,"pass","准备"]);
else if (ready) {
// The 3D table's Ready container also holds seat-change controls. Only reskin
// the actual Ready button; preserve the other seats' controls and their sizes.
function visit(node) {
var button = node.getComponent(cc.Button);
if (button && (button.clickEvents || []).some(function(event) { return event.handler === "onClickReady"; }))
specs.push([node,"pass","准备"]);
(node.children || []).forEach(visit);
}
visit(ready);
}
return specs;
}
exports.applyWaiting = function(controller) {
loadNamed(controller, waitingSpecs(controller));
};
exports.applyTable = function(controller) {
loadNamed(controller, waitingSpecs(controller).concat([
["btnClubOnline","tip","在线玩家"],
["shareEnd","tip","分享"],["next","put","继续"],["gameend","put","总结算"]
]));
};
exports.applySettlement = function(controller) {
loadNamed(controller, [
["btnNext","put","继续"],["btnEnd","put","总结算"],
["btnExit","pass","退出"],["btnShare","tip","分享"]
]);
};
exports.applyGdTable = function(controller) {
loadNamed(controller, waitingSpecs(controller).concat([
["btnClubOnline","tip","在线玩家"],
["shareEnd","put","退出"],["next","tip","继续"],["gameend","put","总结算"]
]));
};
exports.applyDdzSettlement = function(controller) {
loadNamed(controller, [
["btnNext","tip","继续"],["btnEnd","put","总结算"],
["btnShare","put","退出"]
]);
};
exports.applyPiao = function(controller) {
loadNamed(controller, controller.piaoBtns.map(function(node,index) {
return [node,index === 0 ? "pass" : "put",index === 0 ? "不叫" : controller.piaoDesc[index-1]];
}));
};
