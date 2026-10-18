const SHOPPING_MALL_PREFAB_ASSET =
  'res/import/5e/5e000148-4ec5-4edb-923a-9ae171e2b493.json';

const patchShoppingMallPrefab = (bytes) => {
  const prefab = JSON.parse(bytes.toString('utf8'));
  const bgGrey = prefab[3];
  const tips = prefab[34];
  const word = prefab[35];
  const richText = word?._components?.find((component) => component.__type__ === 'cc.RichText');
  const labels = [36, 37, 38].map((index) => prefab[index]?._components?.find(
    (component) => component.__type__ === 'cc.Label'));
  if (!Array.isArray(prefab) || prefab[0]?._name !== 'ShoppingMall'
      || bgGrey?._name !== 'BgGrey' || bgGrey?._contentSize?.height !== 720
      || tips?._name !== 'tips' || tips?._contentSize?.height !== 50
      || word?._name !== 'word' || !richText || labels.some((label) => !label)) {
    throw new Error('商城预制界面的遮罩或提示节点异常');
  }
  bgGrey._active = false;
  tips._active = false;
  richText['_N$string'] = '';
  for (const label of labels) {
    label._string = '';
    label['_N$string'] = '';
  }
  return Buffer.from(JSON.stringify(prefab));
};

module.exports = { SHOPPING_MALL_PREFAB_ASSET, patchShoppingMallPrefab };
