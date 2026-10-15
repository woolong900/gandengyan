const assert = require('assert');
const path = require('path');

const pending = new Map();

class Sprite {
  constructor() {
    this.isValid = true;
    this.spriteFrame = null;
  }
}

global.cc = {
  _RF: { push() {}, pop() {} },
  Sprite,
  SpriteFrame: class SpriteFrame {},
  Prefab: class Prefab {},
  error() {},
  loader: {
    getRes() { return null; },
    loadRes(resourcePath, type, callback) {
      pending.set(resourcePath, callback);
    },
  },
};

const loaderPath = path.join(
  __dirname,
  '..',
  'client-release-source',
  'assets',
  'Script',
  'Recovered',
  'Loader.js',
);
const Loader = require(loaderPath).default;
const sprite = new Sprite();

Loader.setImg('cards/A', sprite);
Loader.setImg('cards/B', sprite);
pending.get('cards/B')(null, { name: 'B' });
assert.equal(sprite.spriteFrame.name, 'B', '新牌面回调没有正常生效');
pending.get('cards/A')(null, { name: 'A' });
assert.equal(sprite.spriteFrame.name, 'B', '旧请求晚返回后覆盖了新牌面');

const nodeSprite = new Sprite();
const node = {
  isValid: true,
  getComponent(component) {
    assert.equal(component, Sprite);
    return nodeSprite;
  },
};
Loader.setImg('cards/C', node);
Loader.setImg('cards/D', node);
pending.get('cards/D')(null, { name: 'D' });
pending.get('cards/C')(null, { name: 'C' });
assert.equal(nodeSprite.spriteFrame.name, 'D', '节点形式的旧回调仍然会覆盖新牌面');

delete require.cache[require.resolve(loaderPath)];
delete global.cc;
console.log('客户端牌面异步加载竞态校验通过');
