const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const meta = JSON.parse(read('cocos-client/assets/resources/_RecoveredDependencies/Textures/115e5c564.png.meta')).subMetas.duiyoupai;
const scene = JSON.parse(read('cocos-client/assets/resources/Games/gd/Scene/SceneGD.fire'));
const saved = scene.find(x => x.duiyoupai && x.myCardsPointer);
assert.equal(scene[saved.duiyoupai.__id__]._name, 'duiyoupai');
const out = {}, listeners = {}, drawn = [];
const events = {data_hand_card_remove: 'remove', data_hand_card_reset: 'reset',
  data_hand_card_remove_firend: 'friend', data_status_change: 'status', ui_my_card_choose_change: 'choose'};
const status = {Gameing: 2, SingleEnd: 3, Free: 0, gongpai: 4};
const seat = {handCards: [31, 42], friendhandCards: []};
const info = {status: status.Gameing, siteInfos: {get: () => seat}};
const bus = {on(names, fn){for (const name of [].concat(names)) listeners[name] = fn;}, emit(){}};
const texture = {}, source = {getTexture: () => texture};
const sprite = {spriteFrame: source};
const prompt = {active: false, getComponent: () => sprite,
  setContentSize(w,h){this.width=w;this.height=h;}};
const cc = {_RF: {push(){}, pop(){}}, _decorator: {ccclass: c => c, property: () => () => {}},
  Component: function(){}, Node: function(){}, Sprite: {SizeMode: {CUSTOM: 0}, Type: {SIMPLE: 0}},
  rect: (x,y,width,height) => ({x,y,width,height}), v2: (x,y) => ({x,y}), size: (width,height) => ({width,height}),
  SpriteFrame: function(texture, rect, rotated, offset, size) {
    Object.assign(this, {texture,rect,rotated,offset,size});
    this.destroy = () => {this.destroyed=true;};
  }};
const mocks = {RoomInfoData: {default: {myAbsolutePos: () => 0, gameInfoGD: info}},
  GDEnum: {eGDGameStatus: status}, GDEventKeys: {default: events},
  GDCardUtils: {default: {sortDesc: cards => cards.slice()}},
  gContext: {default: {eventUtils: bus}}, EventUtils: {eOffType: {OnDestroy: 1}}};
vm.runInNewContext(read('cocos-client/assets/Script/Recovered/GDMyCardsChangeCtr.js'), {
  module: {exports: out}, exports: out, cc,
  require: name => mocks[name.replace('./','')] || {default: function(){}}
});
const view = new out.default();
view.duiyoupai = prompt;
view.myCardsPointer = {node: {setScale(){}, setPosition(){}},
  hideAll(){drawn.length=0;}, setCard(i,card,unused,friend){drawn.push({card,friend});}};
view.onLoad(); view.start();
const fixed = sprite.spriteFrame;
assert.equal(fixed.rect.width, meta.width);
assert.equal(fixed.rect.height, meta.height);
assert.equal(fixed.rect.x, meta.trimX);
assert.equal(fixed.rect.y, meta.trimY);
assert.equal(fixed.rotated, meta.rotated);
assert.equal(fixed.size.width, 183);
assert.equal(fixed.size.height, 52);
assert.equal(fixed.offset.x, 0); assert.equal(fixed.offset.y, 0);
assert.equal(fixed.texture, texture);
assert.equal(prompt.active, false);

// Finished local hand with no teammate payload must not leave a stray label.
seat.handCards = []; listeners.remove(null,{pos:0}); view.update();
assert.equal(prompt.active, false);
// Preserve the native feature when an actual teammate hand is available.
seat.friendhandCards = [71,82]; listeners.friend(null,{pos:0}); view.update();
assert.equal(prompt.active, true);
assert.deepEqual(drawn, [{card:71,friend:true},{card:82,friend:true}]);
// A new hand clears the sibling label synchronously, even if its controller
// is disabled before the next update while the native deal is running.
seat.handCards = [31,42]; listeners.reset(null,{pos:0});
assert.equal(prompt.active, false);
view.myCardsPointer._dealing = true; prompt.active = true; view.update();
assert.equal(prompt.active, false);
prompt.active = true; view._updateUI(); assert.equal(prompt.active, false);
view.myCardsPointer._dealing = false; view.update(); assert.equal(prompt.active, false);
seat.handCards = []; view._updateUI(); assert.equal(prompt.active, true);
for (const phase of [status.SingleEnd, status.Free, status.gongpai]) {
  prompt.active = true; info.status = phase; listeners.status();
  assert.equal(prompt.active, false); view.update(); assert.equal(prompt.active, false);
}
view.onDestroy(); assert.equal(fixed.destroyed,true);
assert.equal(source.destroyed,undefined);
assert.ok(read('cocos-client/build/web-mobile/assets/main/index.js').includes('this._friendHandFrame = new cc.SpriteFrame'));
console.log('PASS GD teammate prompt: complete rotated 183x52 art; shown only with teammate cards; hidden during deal, new round, settlement and tribute; included in PWA');
