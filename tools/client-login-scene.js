const LOGIN_SCENE_ASSET = 'res/import/c7/c7580864-d9b1-4542-af37-53010c85cb3b.json';

const hideNodePermanently = (node) => {
  node._active = false;
  node._opacity = 0;
  node._scale = { __type__: 'cc.Vec3', x: 0, y: 0, z: 1 };
};

const patchLoginScene = (bytes) => {
  const scene = JSON.parse(bytes.toString('utf8'));
  const editboxNode = scene.find((entry) => entry?.__type__ === 'cc.Node'
    && entry._name === 'editboxTestAccount');
  const loginButtonNode = scene.find((entry) => entry?.__type__ === 'cc.Node'
    && entry._name === 'buttonTestLogin');
  if (!editboxNode || !loginButtonNode) throw new Error('登录场景缺少测试账号节点');

  hideNodePermanently(editboxNode);
  hideNodePermanently(loginButtonNode);

  for (const entry of scene) {
    if (entry?.__type__ === 'cc.Label'
        && (entry._string === '测试ID登录' || entry._N$string === '测试ID登录'
          || entry._string === '107000~107100' || entry._N$string === '107000~107100')) {
      entry._string = '';
      entry._N$string = '';
    }
  }
  return Buffer.from(JSON.stringify(scene));
};

module.exports = { LOGIN_SCENE_ASSET, patchLoginScene };
