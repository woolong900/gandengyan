const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const imported = JSON.parse(fs.readFileSync(path.join(root,
  'cocos-client/build/web-mobile/assets/resources/import/07/071f2fdc0.json')));
function findFrame(value) {
  if (!value || typeof value !== 'object') return;
  if (value.name === 'time' && value.rect) return value;
  for (const child of Object.values(value)) {
    const frame = findFrame(child);
    if (frame) return frame;
  }
}
const frame = findFrame(imported);
assert.ok(frame, 'test the actual web import, not just corrected editor metadata');
const original = JSON.stringify(frame);
const output = {};
const cc = {
  Sprite: {SizeMode: {CUSTOM: 0}, Type: {SIMPLE: 0}},
  v2: (x, y) => ({x, y}), size: (width, height) => ({width, height}),
  SpriteFrame: function(texture, rect, rotated, offset, size) {
    Object.assign(this, {texture, rect, rotated, offset, size});
  }
};
vm.runInNewContext(fs.readFileSync(path.join(root,
  'cocos-client/assets/Script/Recovered/PokerClockStyle.js'), 'utf8'), {exports: output, cc});
for (const game of ['ddz', 'gd']) {
  const scene = JSON.parse(fs.readFileSync(path.join(root,
    `cocos-client/assets/resources/Games/${game}/Scene/Scene${game.toUpperCase()}.fire`)));
  const clocks = scene.filter(x => x.rootNode && x.timeLabel && x.posCtr);
  assert.equal(clocks.length, game === 'ddz' ? 3 : 4);
  for (const clock of clocks) {
    const node = scene[clock.rootNode.__id__];
    const sourceSprite = node._components.map(x => x.__id__ === undefined ? x : scene[x.__id__]).find(x => x && x.__type__ === 'cc.Sprite');
    assert.ok(['637e6c05-aa5a-4033-b367-f6305f7c0142', '63fmwFqlpAM7Nn9jBffAFC'].includes(sourceSprite._spriteFrame.__uuid__));
    const texture = {};
    const sprite = {sizeMode: sourceSprite._sizeMode, trim: sourceSprite._isTrimmedMode,
      spriteFrame: {getTexture: () => texture,
        getRect: () => ({x: frame.rect[0], y: frame.rect[1], width: frame.rect[2], height: frame.rect[3]}),
        isRotated: () => !!frame.rotated}};
    const mockNode = {getComponent: () => sprite, setContentSize(w, h){this.width=w;this.height=h;}};
    const fixed = output.apply(mockNode);
    assert.equal(fixed, sprite.spriteFrame);
    assert.equal(fixed.texture, texture, 'keep the original art and rotation');
    assert.equal(fixed.rotated, true);
    assert.equal(fixed.offset.x, 0);
    assert.equal(fixed.offset.y, 0, 'dial must stay centered on the number, not 199 units below it');
    assert.equal(fixed.size.width, 94);
    assert.equal(fixed.size.height, 92);
    assert.equal(mockNode.width, 94);
    assert.equal(mockNode.height, 92);
    assert.equal(sprite.sizeMode, cc.Sprite.SizeMode.CUSTOM);
    assert.equal(sprite.trim, true);
  }
}
assert.equal(JSON.stringify(frame), original, 'other users of the atlas are unchanged');
assert.equal(output.apply(null), null);
// Exercise the shipped module table too: a helper file alone is not enough
// when the recovery bundler uses an explicit allowlist for added modules.
const bundle = fs.readFileSync(path.join(root, 'cocos-client/build/web-mobile/assets/main/index.js'), 'utf8');
const context = {window: {}, cc};
vm.runInNewContext(bundle.replace(/\},\{\},\[[^\n]*\]\);\s*$/, '},{},[]);'), context);
assert.equal(typeof context.window.__require('PokerClockStyle').apply, 'function');
console.log('PASS actual web clock import: all 7 DDZ/GD clocks normalized to 94x92 and zero offset without changing shared assets');
