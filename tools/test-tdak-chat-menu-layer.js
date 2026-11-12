const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../cocos-client/assets/Script/TDak/TDakStandalone.js'), 'utf8');
let methods, instantiated = 0;
const cc = {
  Color: function() {}, Component: function() {},
  Class(spec) { methods = spec; return spec; },
  isValid: node => !!node && !node.destroyed,
  instantiate() { instantiated++; throw Error('chat must not open behind an expanded menu'); }
};
vm.runInNewContext(source, {cc, require: () => ({default:{}, ACTION:{}})});

// Check the authored sibling ordering, independent of asynchronous load order.
const menuZ = Number(source.match(/_chromeLayer\.addChild\(menu, (\d+)\)/)[1]);
const buttonZ = Number(source.match(/_chromeLayer\.addChild\(button, (\d+)\)/)[1]);
const speechZ = Number(source.match(/_chromeLayer\.addChild\(node, (\d+)\)/)[1]);
assert.ok(menuZ > buttonZ && menuZ > speechZ);
for (const order of [[menuZ,buttonZ,speechZ],[buttonZ,speechZ,menuZ]]) {
  assert.equal(order.sort((a,b)=>a-b).at(-1), menuZ);
}
// Settings/dialogs retain their parent layer above the entire table chrome.
assert.ok(source.includes('this.node.addChild(this._chromeLayer, 70)'));
assert.ok(source.includes('this.node.addChild(this._modal, 100)'));

const popup = {removeFromParent(){this.removed=true;},destroy(){this.destroyed=true;}};
const controller = Object.assign({}, methods, {
  _shzMenuPanel:{active:false}, _ddzChatPopup:popup,
  _ddzChatConfig:{}, _ddzChatPrefab:{}, _ddzChatButton:{active:true}
});
controller._setSHZMenuOpen(true);
assert.equal(controller._shzMenuPanel.active,true);
assert.ok(popup.removed && popup.destroyed);
assert.equal(controller._ddzChatPopup,null);
controller._showDDZChatLayer();
assert.equal(instantiated,0,'covered chat entry cannot open a modal');
assert.equal(controller._ddzChatButton.active,true,'entry stays underneath instead of disappearing');
controller._setSHZMenuOpen(false);
assert.equal(controller._shzMenuOpen,false);
assert.equal(controller._shzMenuPanel.active,false);
assert.throws(()=>controller._showDDZChatLayer(),/chat must not open/);
assert.equal(instantiated,1,'chat can be opened again after menu closes');
console.log('PASS TDak: menu above chat entry and speech, async order independent, covered clicks blocked, popup dismissed, chat restored after closing');
