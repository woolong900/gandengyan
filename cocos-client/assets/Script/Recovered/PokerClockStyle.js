"use strict";

// The recovered web import of `time` retains an atlas-sized originalSize
// (98 x 500) and offset (1, -199). RAW/untrimmed opponent sprites therefore
// draw the dial far below their number, near the local avatar. Source .meta
// is corrected, but JS-only PWA builds still use those recovered imports.
// Normalize only this clock's private frame; do not mutate shared atlas data.
exports.apply = function(root) {
var sprite = root && root.getComponent(cc.Sprite);
var source = sprite && sprite.spriteFrame;
if (!source) return null;
var rect = source.getRect();
var frame = new cc.SpriteFrame(source.getTexture(), rect, source.isRotated(),
cc.v2(0, 0), cc.size(rect.width, rect.height));
sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
sprite.type = cc.Sprite.Type.SIMPLE;
sprite.trim = true;
sprite.spriteFrame = frame;
root.setContentSize(rect.width, rect.height);
return frame;
};
