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

  const loadingLayerNode = scene.find((entry) => entry?.__type__ === 'cc.Node'
    && entry._name === 'LoadingLayer');
  const loadingLayer = (loadingLayerNode?._components || [])
    .find((component) => component?.__type__ === 'd9c39za1dlEm6nt66eZh2f0');
  const updateDescLabel = scene[loadingLayer?.desc?.__id__];
  const updateDescNode = scene[updateDescLabel?.node?.__id__];
  if (!updateDescNode || updateDescNode._name !== 'Desc' || !updateDescNode._contentSize
      || updateDescLabel?.__type__ !== 'cc.Label') {
    throw new Error('登录场景缺少更新说明节点或文字组件');
  }

  // 原节点只有 250px 宽且允许自动换行，长文案会被拆成多行后再按
  // 50px 高度裁掉，画面上只能看到中间几个字。进度条宽 947px，给
  // 状态文字保留 760px 的单行区域即可完整显示最多三个动画点号。
  updateDescNode._contentSize.width = 760;
  updateDescNode._contentSize.height = 52;
  updateDescLabel._enableWrapText = false;
  updateDescLabel._N$horizontalAlign = 1;
  updateDescLabel._N$verticalAlign = 1;
  updateDescLabel._N$overflow = 1;

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
