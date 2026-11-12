"use strict";
// Recovered PWA imports contain atlas-sized untrimmed frames and clipped rotated
// rects. These are the original source .meta rects, not redrawn replacement art.
function frame(node, rect, rotated) {
var sprite = node && node.getComponent(cc.Sprite), source = sprite && sprite.spriteFrame;
if (!source) return null;
var fixed = new cc.SpriteFrame(source.getTexture(), cc.rect(rect[0], rect[1], rect[2], rect[3]),
rotated, cc.v2(0, 0), cc.size(rect[2], rect[3]));
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
sprite.type = cc.Sprite.Type.SIMPLE;
sprite.trim = true;
sprite.spriteFrame = fixed;
node.setContentSize(rect[2], rect[3]);
return fixed;
}
exports.titles = function(view) {
return [frame(view.winNode, [300, 3, 567, 171], true), frame(view.loseNode, [166, 3, 594, 128], true)];
};
exports.roles = function(cell) {
return [frame(cell.zhuang, [3, 225, 28, 28], false), frame(cell.nongmin, [37, 225, 28, 28], false)];
};
exports.release = function(frames) { (frames || []).forEach(function(value) { if (value) value.destroy(); }); };
