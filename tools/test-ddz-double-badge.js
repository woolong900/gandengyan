const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
function collect(value, predicate, result = []) {
  if (!value || typeof value !== 'object') return result;
  if (predicate(value)) result.push(value);
  Object.values(value).forEach(child => collect(child, predicate, result));
  return result;
}
const scene = JSON.parse(read('cocos-client/assets/resources/Games/ddz/Scene/SceneDDZ.fire'));
const controllers = collect(scene, x => x.jiabei && x.posCtr);
assert.equal(controllers.length, 3);
const imported = JSON.parse(read('cocos-client/build/web-mobile/assets/resources/import/07/071f2fdc0.json'));
const original = collect(imported, x => x.name === 'jiab' && x.rect)[0];
assert.deepEqual(original.rect, [3, 159, 65, 65]);
const before = JSON.stringify(original);
const cc = {
  _RF: {push(){}, pop(){}}, _decorator: {ccclass: c => c, property: () => () => {}},
  Component: function(){}, Node: function(){}, Label: function(){},
  Sprite: {SizeMode: {CUSTOM: 0}, Type: {SIMPLE: 0}},
  v2: (x,y) => ({x,y}), size: (width,height) => ({width,height}),
  SpriteFrame: function(texture, rect, rotated, offset, size) {
    Object.assign(this, {texture,rect,rotated,offset,size});
    this.destroy = () => {this.destroyed = true;};
  }
};
const output = {};
vm.runInNewContext(read('cocos-client/assets/Script/Recovered/DDZPosPlayerInfoCtr.js'), {
  cc, module: {exports: output}, exports: output, require: () => ({default: {}})
});
for (const saved of controllers) {
  const node = scene[saved.jiabei.__id__];
  const component = node._components.map(x => x.__id__ === undefined ? x : scene[x.__id__])
    .find(x => x.__type__ === 'cc.Sprite');
  assert.equal(component._spriteFrame.__uuid__, 'c1f1969d-352d-4443-b88e-761bf4f3969a');
  const texture = {};
  const source = {getTexture: () => texture, isRotated: () => false,
    getRect: () => ({x: 3, y: 159, width: 65, height: 65})};
  const sprite = {sizeMode: component._sizeMode, spriteFrame: source};
  const badge = {active: false, getComponent: () => sprite,
    setContentSize(w,h){this.width=w;this.height=h;}};
  const view = new output.default();
  view.jiabei = badge;
  view.onLoad();
  const fixed = sprite.spriteFrame;
  assert.equal(fixed.texture, texture);
  assert.equal(fixed.size.width, 65);
  assert.equal(fixed.size.height, 65);
  assert.equal(fixed.offset.x, 0);
  assert.equal(fixed.offset.y, 0);
  assert.equal(sprite.sizeMode, cc.Sprite.SizeMode.CUSTOM);
  assert.equal(sprite.trim, true);
  assert.equal(badge.width, badge.height);
  assert.equal(badge.active, false, 'styling must not display an unearned double');
  for (const doubled of [2, 1, 2, 0]) {
    view._getPlayer = () => ({isDouble: doubled});
    view.doubleUpdate();
    assert.equal(badge.active, doubled === 2);
    assert.equal(sprite.spriteFrame, fixed, 'round changes must reuse the normalized frame');
  }
  view.onDestroy();
  assert.equal(fixed.destroyed, true);
  assert.equal(source.destroyed, undefined, 'never destroy the shared original frame');
}
assert.equal(JSON.stringify(original), before);
// Verify the code actually ships in the recovered bundle.
assert.ok(read('cocos-client/build/web-mobile/assets/main/index.js').includes('this._doubleBadgeFrame = new cc.SpriteFrame'));
console.log('PASS DDZ: all three double badges use 65x65 zero-offset frames; visibility, round reuse and cleanup preserved; fix included in web bundle');
