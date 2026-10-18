#!/usr/bin/env node
/**
 * 从已签名 APK/IPA 生成 Cocos AssetsManager 可直接使用的全量资源版本。
 * 每个版本目录都自包含，旧客户端可直接跨版本比较并只下载变化的文件。
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { toJs } = require('./jsc');
const { buildReleaseProjectJsc } = require('./client-release-project');
const { LOGIN_SCENE_ASSET, patchLoginScene } = require('./client-login-scene');
const { makeBuildDir } = require('./build-workspace');
const { pruneLocal } = require('./prune-release-artifacts');
const { releaseGitInfo } = require('./release-git');

const argv = process.argv.slice(2);
const arg = (name, fallback = '') => {
  const index = argv.indexOf(`--${name}`);
  if (index < 0) return fallback;
  if (!argv[index + 1]) throw new Error(`--${name} 缺少参数`);
  return argv[index + 1];
};
const ROOT = path.join(__dirname, '..');
const VERSION = Number(arg('version'));
const FULL_RELEASE = argv.includes('--full-release');
const STABLE_VERSION = Number(arg('stable-version', String(Math.max(1, VERSION - 1))));
const PACKAGE_VERSION = arg('package-version', '1.0.6');
const BASE_URL = arg('base-url', process.env.QJQP_PUBLIC_BASE_URL || '').replace(/\/$/, '');
const SERVICE_BASE_URL = arg('service-base-url', BASE_URL).replace(/\/$/, '');
const ANDROID = arg('android');
const IOS = arg('ios');
const gitInfo = releaseGitInfo(ROOT);
if (!Number.isSafeInteger(VERSION) || VERSION < 1) throw new Error('--version 必须是正整数');
if (!Number.isSafeInteger(STABLE_VERSION) || STABLE_VERSION < 1 || STABLE_VERSION > VERSION) {
  throw new Error('--stable-version 必须是小于等于候选版本的正整数');
}
if (!BASE_URL || !/^https?:\/\//.test(BASE_URL)) throw new Error('--base-url 必须是完整 HTTP(S) 地址');
if (!SERVICE_BASE_URL || !/^https?:\/\//.test(SERVICE_BASE_URL)) {
  throw new Error('--service-base-url 必须是完整 HTTP(S) 地址');
}
if (!ANDROID && !IOS) throw new Error('至少指定 --android APK 或 --ios IPA');
if (argv.includes('--require-clean-git') && gitInfo.dirty) {
  throw new Error('正式发布要求干净的 Git 工作区；请先审阅并提交改动');
}

const output = path.resolve(arg('out', path.join(ROOT, 'dist', `hot-update-${VERSION}`)));
if (fs.existsSync(output)) throw new Error(`输出目录已存在：${output}`);
fs.mkdirSync(path.dirname(output), { recursive: true });
const stage = fs.mkdtempSync(path.join(path.dirname(output), `.hot-update-${VERSION}-`));
const work = makeBuildDir('qjqp-hot-update', { minimumFreeBytes: 3 * 1073741824 });
const manifestAsset = 'res/raw-assets/2c/2c8a7447-5900-4cca-b1ef-51d750d90396.manifest';
const qjshzSources = {
  table: path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', '609a7ea7-dcd3-4770-9830-847e4aecacbf.jpg'),
  action: path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', '19c83aa89.png'),
  quick: path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', '0968299a-e998-4a49-9435-69aa1a61b8ff.png'),
  busyExit: path.join(ROOT, 'assets', 'branding', 'settlement', 'btn-exit-busy-orange-v4.png'),
};
const qjshzActionFrames = new Map([
  ['res/import/09/0917b935-dda6-4328-a3ca-787150d44ada.json', ['btn_put_0', [0, 300, 342, 130]]],
  ['res/import/27/27387181-5f14-4895-af4e-933b352393c0.json', ['btn_tip_1', [354, 300, 342, 130]]],
  ['res/import/46/4691cf77-d69a-452d-a53e-e87163484bd3.json', ['btn_pass', [0, 430, 342, 130]]],
  ['res/import/97/97124936-198a-4e07-a165-f73bc2450074.json', ['btn_put_1', [354, 430, 342, 130]]],
  ['res/import/ba/bae9014a-f7c1-4216-b55d-669bd229c290.json', ['btn_tip_0', [0, 560, 342, 130]]],
]);
// 潜江千分 1.9.0 的原始牌面已按现有坐标写入四张动态图集。发布前校验
// 解密后的像素文件，防止以后换底包时悄悄退回干瞪眼原来的小字牌面。
const qjshzPokerAtlases = new Map([
  ['res/raw-assets/15/1580e8a3b.png', {
    source: path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', '1580e8a3b.png'),
    checksum: 'b1689dbfae7c77e5be88864e9a38aeb5',
  }],
  ['res/raw-assets/1e/1e79e9934.png', {
    source: path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', '1e79e9934.png'),
    checksum: 'd2115cefd1c9bf9e00697dc644dc4483',
  }],
  ['res/raw-assets/1a/1a62d6dfc.png', {
    source: path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', '1a62d6dfc.png'),
    checksum: '57ed7bf7a58163568c7bb835c2356242',
  }],
  ['res/raw-assets/19/191f83490.png', {
    source: path.join(ROOT, 'client-release-source', 'assets', 'resources', '_RecoveredDependencies', 'Textures', '191f83490.png'),
    checksum: '274f537e393fc093d2a39b0e9efe8e5d',
  }],
]);
const shareSources = {
  downloadQr: path.join(ROOT, 'assets', 'branding', 'share', 'download-qr.png'),
  momentsPoster: path.join(ROOT, 'assets', 'branding', 'share', 'moments-poster.jpg'),
};
const clubHomeBackground = path.join(
  ROOT, 'assets', 'branding', 'club', 'club-home-background.jpg',
);
const tableBackground3d = {
  android: path.join(ROOT, 'assets', 'branding', 'table', 'table-background-3d.jpg'),
  ios: path.join(ROOT, 'assets', 'branding', 'table', 'table-background-3d-ios.png'),
};
const tableText3d = path.join(
  ROOT, 'assets', 'branding', 'table', 'table-text-3d.png',
);
const paiDunGreenRoot = path.join(
  ROOT, 'assets', 'branding', 'table', 'pd-ani-green',
);
const qjshzBusyExit = {
  textureUuid: 'e07c10f8-e75a-5ae8-d2f6-40c4b109d372',
  texturePackedUuid: 'e0fBD451pa6NL2QMSxCdNy',
  spriteUuid: 'e9e4084a-b40b-f780-a5dd-ed4476da7ba7',
  spritePackedUuid: 'e95AhKtAv3gKXd7UR22nun',
};
const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');

const encryptCocosImage = (source) => {
  const key = 0x77;
  const input = fs.readFileSync(source);
  const encrypted = Buffer.alloc(input.length);
  for (let index = 0; index < input.length; index += 1) encrypted[index] = input[index] ^ key;
  return Buffer.concat([Buffer.from('aaabbbccc', 'ascii'), Buffer.from([key]), encrypted]);
};

const patchQjshzScene = (bytes) => {
  const scene = JSON.parse(bytes.toString('utf8'));
  const expectNode = (index, name) => {
    const node = scene[index];
    if (!node || node.__type__ !== 'cc.Node' || node._name !== name) {
      throw new Error(`说胡子场景节点异常：${index} 预期 ${name}`);
    }
    return node;
  };

  delete expectNode(5, 'bg2')._active;
  const playerBottom = expectNode(136, 'db');
  playerBottom._components = playerBottom._components.filter((component) => component.__type__ !== 'cc.Sprite');
  if (playerBottom._components.some((component) => component.__type__ === 'cc.Sprite')) {
    throw new Error('说胡子底部半透明底板移除失败');
  }

  // 原场景三个主操作按钮使用 Sprite 过渡，但“按下”仍指向正常图，
  // 因而移动端看不到任何反馈。改为颜色过渡：按下轻微变暗，禁用时
  // 明显置灰；这样也不需要新增资源 UUID，老客户端可直接热更新。
  const configureActionButton = (button, name) => {
    if (!button || button.__type__ !== 'cc.Button') {
      throw new Error(`说胡子${name}按钮组件异常`);
    }
    button._N$transition = 1;
    button.transition = 1;
    button._N$normalColor = { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 };
    button._N$pressedColor = { __type__: 'cc.Color', r: 220, g: 220, b: 220, a: 255 };
    button.pressedColor = { __type__: 'cc.Color', r: 220, g: 220, b: 220, a: 255 };
    button._N$hoverColor = { __type__: 'cc.Color', r: 255, g: 255, b: 255, a: 255 };
    button._N$disabledColor = { __type__: 'cc.Color', r: 76, g: 76, b: 76, a: 255 };
  };
  configureActionButton(expectNode(237, 'BtnPutPass')._components[0], '不出');
  configureActionButton(expectNode(251, 'BtnTip')._components[0], '提示');
  configureActionButton(scene[257], '出牌');

  const quickButtons = [272, 276, 280, 284, 288, 292, 296, 300];
  for (const index of quickButtons) {
    const node = expectNode(index, 'btn_blue');
    if (!node._contentSize || node._contentSize.width !== 128) {
      throw new Error(`说胡子快捷按钮尺寸异常：${index}`);
    }
    node._contentSize.height = 39;
    const labelNode = scene[index + 1];
    const label = scene[index + 2];
    if (!labelNode || labelNode._name !== 'New Label' || !label || label.__type__ !== 'cc.Label') {
      throw new Error(`说胡子快捷按钮文字异常：${index}`);
    }
    // 目标按钮缩放到 128x39 后，旧 24px 字体会几乎顶满按钮，视觉上
    // 像有重影。按同一比例缩到 20px，并收紧文字节点高度。
    labelNode._contentSize.height = 25.2;
    label._fontSize = 20;
    label._lineHeight = 20;
  }
  for (const index of [284, 288]) {
    expectNode(index, 'btn_blue')._color = { __type__: 'cc.Color', r: 210, g: 170, b: 215, a: 255 };
  }
  for (const index of [292, 296, 300]) {
    expectNode(index, 'btn_blue')._color = { __type__: 'cc.Color', r: 240, g: 110, b: 225, a: 255 };
  }
  return Buffer.from(JSON.stringify(scene));
};

const patchQjshzQuickFrame = (bytes) => {
  const frame = JSON.parse(bytes.toString('utf8'));
  const content = frame && frame.content;
  if (!content || content.name !== 'btn_blue'
      || !Array.isArray(content.rect) || content.rect[2] !== 128
      || !Array.isArray(content.originalSize) || content.originalSize[0] !== 128) {
    throw new Error('说胡子快捷按钮 SpriteFrame 数据异常');
  }
  // 替换图是目标游戏按钮按设计比例缩放后的 128x39。原 APK 的
  // SpriteFrame 仍为 128x55，会越过纹理底部取样并重复最后几行像素，
  // 表现为按钮下沿重影。帧尺寸必须与真实 PNG 严格一致。
  content.rect = [0, 0, 128, 39];
  content.originalSize = [128, 39];
  content.offset = [0, 0];
  return Buffer.from(JSON.stringify(frame));
};

const patchQjshzActionFrame = (bytes, expectedName, rect) => {
  const frame = JSON.parse(bytes.toString('utf8'));
  const content = frame && frame.content;
  if (!content || content.name !== expectedName || content.texture !== '19c83aa89') {
    throw new Error(`说胡子高清操作按钮 SpriteFrame 数据异常：${expectedName}`);
  }
  content.rect = rect;
  content.originalSize = [342, 130];
  content.offset = [0, 0];
  return Buffer.from(JSON.stringify(frame));
};

const patchSingleEndPrefab = (bytes) => {
  const prefab = JSON.parse(bytes.toString('utf8'));
  const expectNode = (index, name) => {
    const node = prefab[index];
    if (!node || node.__type__ !== 'cc.Node' || node._name !== name) {
      throw new Error(`单局结算节点异常：${index} 预期 ${name}`);
    }
    return node;
  };
  const handlerOf = (node) => node._components
    .find((component) => component.__type__ === 'cc.Button')
    ?.clickEvents?.[0]?.handler;
  const existingContinue = prefab[5];
  const existingExit = prefab[8];
  if (existingContinue?._name === 'BtnContinueBottom' && existingExit?._name === 'BtnExitBottom') {
    if (handlerOf(existingContinue) !== 'onNext' || handlerOf(existingExit) !== 'onQuitRoom'
        || existingContinue._position?.x !== 125 || existingContinue._position?.y !== -303
        || existingExit._position?.x !== 290 || existingExit._position?.y !== -303) {
      throw new Error('单局结算已修改节点状态异常');
    }
    return bytes;
  }
  const continueNode = expectNode(5, 'BtnNext');
  const exitNode = expectNode(8, 'BtnQuit');
  if (handlerOf(continueNode) !== 'onNext' || handlerOf(exitNode) !== 'onQuitRoom') {
    throw new Error('单局结算继续/退出事件绑定异常');
  }

  // 原右上角退出节点不再保留；两个序列化槽位在右下角重新定义为
  // 独立的“继续”和“退出”按钮，避免改动其余对象的引用编号。
  continueNode._name = 'BtnContinueBottom';
  continueNode._position = { __type__: 'cc.Vec3', x: 125, y: -303 };
  continueNode._scale = { __type__: 'cc.Vec3', x: 0.5, y: 0.5, z: 1 };
  exitNode._name = 'BtnExitBottom';
  exitNode._position = { __type__: 'cc.Vec3', x: 290, y: -303 };
  exitNode._scale = { __type__: 'cc.Vec3', x: 0.9, y: 0.9, z: 1 };
  if (prefab.some((item) => item && item.__type__ === 'cc.Node' && item._name === 'BtnQuit')) {
    throw new Error('单局结算右上角旧退出按钮删除失败');
  }
  return Buffer.from(JSON.stringify(prefab));
};

const patchWskSingleEndPrefab = (bytes) => {
  const prefab = JSON.parse(bytes.toString('utf8'));
  const expectNode = (index, name) => {
    const node = prefab[index];
    if (!node || node.__type__ !== 'cc.Node' || node._name !== name) {
      throw new Error(`说胡子单局结算节点异常：${index} 预期 ${name}`);
    }
    return node;
  };
  const root = expectNode(30, 'qjshz');
  const bgNode = expectNode(32, 'bgNode');
  const handlerOf = (node) => node._components
    .find((component) => component.__type__ === 'cc.Button')
    ?.clickEvents?.[0]?.handler;
  const existingExit = prefab[33];
  const existingContinue = prefab[34];
  const existingBottomExit = prefab[35];
  if (existingExit?._name === 'RemovedTopExit'
      && existingContinue?._name === 'BtnGameNext'
      && existingBottomExit?._name === 'BtnExitBottom') {
    if ((bgNode._children || []).some((child) => child.__id__ === 33)
        || existingExit._parent !== null || existingExit._active !== false
        || (existingExit._components || []).length !== 0
        || handlerOf(existingContinue) !== 'onClickNext'
        || handlerOf(existingBottomExit) !== 'onClickExit') {
      throw new Error('说胡子单局结算已修改节点状态异常');
    }
    existingContinue._position = { __type__: 'cc.Vec3', x: 418, y: -222 };
    existingBottomExit._position = { __type__: 'cc.Vec3', x: -418, y: -222 };
    return Buffer.from(JSON.stringify(prefab));
  }
  const exitNode = expectNode(33, 'btn_exit');
  const continueNode = expectNode(34, 'BtnGameNext');
  const shareNode = expectNode(35, 'BtnShare');
  if (handlerOf(exitNode) !== 'onClickExit' || handlerOf(continueNode) !== 'onClickNext') {
    throw new Error('说胡子单局结算继续/退出事件绑定异常');
  }

  if (!(root._children || []).some((child) => child.__id__ === 34)
      || !(root._children || []).some((child) => child.__id__ === 35)
      || !(bgNode._children || []).some((child) => child.__id__ === 33)
      || exitNode._parent?.__id__ !== 32 || continueNode._parent?.__id__ !== 30
      || shareNode._parent?.__id__ !== 30 || shareNode._active === false) {
    throw new Error('说胡子原版分享/继续/退出按钮结构异常');
  }

  // 右上旧退出按钮从节点树与交互组件中移除；保留序列化槽位仅为
  // 避免后续对象编号整体偏移，它不再属于任何父节点，也没有点击事件。
  bgNode._children = bgNode._children.filter((child) => child.__id__ !== 33);
  exitNode._name = 'RemovedTopExit';
  exitNode._parent = null;
  exitNode._components = [];
  exitNode._active = false;

  // 继续按钮保持在右下。原分享按钮移到左下并改绑退出事件，使用
  // 独立复制的新 SpriteFrame，绝不覆盖其他页面仍在复用的分享贴图。
  continueNode._position = { __type__: 'cc.Vec3', x: 418, y: -222 };
  shareNode._name = 'BtnExitBottom';
  shareNode._position = { __type__: 'cc.Vec3', x: -418, y: -222 };
  shareNode._components.find((component) => component.__type__ === 'cc.Sprite')._spriteFrame = {
    __uuid__: qjshzBusyExit.spritePackedUuid,
  };
  const shareClick = shareNode._components
    .find((component) => component.__type__ === 'cc.Button')?.clickEvents?.[0];
  if (!shareClick || shareClick.handler !== 'onClickShare') {
    throw new Error('说胡子分享按钮事件绑定异常');
  }
  shareClick.handler = 'onClickExit';
  return Buffer.from(JSON.stringify(prefab));
};

const patchWskTotalEndCell = (bytes) => {
  const prefab = JSON.parse(bytes.toString('utf8'));
  const infoBg = prefab[9];
  const keyNode = prefab[10];
  const keyLabel = prefab[11];
  const valueNode = prefab[12];
  const valueLabel = prefab[13];
  if (!infoBg || infoBg._name !== 'total_cell_info_bg' || infoBg._contentSize?.height !== 236
      || !keyNode || keyNode._name !== 'New Label' || keyLabel?.__type__ !== 'cc.Label'
      || !valueNode || valueNode._name !== 'New Label copy' || valueLabel?.__type__ !== 'cc.Label') {
    throw new Error('说胡子总结算统计区节点异常');
  }
  // 这里原来只有两项统计，80px 行高在扩展为四项后会超出
  // 236px 的黄色区域。字号保持 24px，只将四行均匀收紧到 180px。
  keyLabel._lineHeight = 45;
  valueLabel._lineHeight = 45;
  keyNode._contentSize.height = 180;
  valueNode._contentSize.height = 180;
  return Buffer.from(JSON.stringify(prefab));
};

const patchQjshzAsset = (name, data) => {
  if (name === LOGIN_SCENE_ASSET) return patchLoginScene(data);
  if (name === 'res/raw-assets/60/609a7ea7-dcd3-4770-9830-847e4aecacbf.jpg') {
    return fs.readFileSync(qjshzSources.table);
  }
  if (name === 'res/raw-assets/19/19c83aa89.png') return encryptCocosImage(qjshzSources.action);
  if (name === 'res/raw-assets/09/0968299a-e998-4a49-9435-69aa1a61b8ff.png') {
    return encryptCocosImage(qjshzSources.quick);
  }
  if (name === 'res/import/dc/dc294676-c185-4f9d-89a5-4085ac3a9175.json') {
    return patchQjshzScene(data);
  }
  if (name === 'res/import/ee/ee9dd0eb-c83f-4802-bfca-98e27e9cc2d5.json') {
    return patchQjshzQuickFrame(data);
  }
  if (qjshzActionFrames.has(name)) {
    const [expectedName, rect] = qjshzActionFrames.get(name);
    return patchQjshzActionFrame(data, expectedName, rect);
  }
  if (name === 'res/import/63/637f38e8-9c8c-424f-ba6c-8b738e0467c7.json') {
    return patchSingleEndPrefab(data);
  }
  if (name === 'res/import/5c/5c282881-ef01-4d39-8c09-c1df292a8db3.json') {
    return patchWskSingleEndPrefab(data);
  }
  if (name === 'res/import/c9/c94a0fd3-4986-461e-84f9-82e8ed06697c.json') {
    return patchWskTotalEndCell(data);
  }
  return data;
};

const patchProject = (bytes) => {
  if (!toJs(bytes)) throw new Error('project.jsc 无法解码');
  return buildReleaseProjectJsc({
    root: ROOT,
    workDir: work,
    assetVersion: VERSION,
    packageVersion: PACKAGE_VERSION,
    serviceBaseUrl: SERVICE_BASE_URL,
  });
};

const publishPlatform = (platform, archive) => {
  const absolute = path.resolve(archive);
  if (!fs.existsSync(absolute)) throw new Error(`找不到 ${platform} 安装包：${absolute}`);
  const unpacked = path.join(work, platform);
  fs.mkdirSync(unpacked);
  execFileSync('unzip', ['-qq', absolute, '-d', unpacked]);
  let appRoot;
  if (platform === 'android') appRoot = path.join(unpacked, 'assets');
  else {
    const payload = path.join(unpacked, 'Payload');
    const apps = fs.readdirSync(payload).filter((name) => name.endsWith('.app'));
    if (apps.length !== 1) throw new Error(`IPA 中 .app 数量异常：${apps.length}`);
    appRoot = path.join(payload, apps[0]);
  }
  JSON.parse(fs.readFileSync(path.join(appRoot, manifestAsset), 'utf8'));
  const destination = path.join(stage, platform, String(VERSION));
  fs.mkdirSync(destination, { recursive: true });
  const assets = {};
  let totalBytes = 0;
  const writeAsset = (name, data, replace = false) => {
    if (assets[name] && !replace) throw new Error(`${platform} 热更新资源重复：${name}`);
    if (assets[name]) totalBytes -= assets[name].size;
    const target = path.join(destination, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, data);
    assets[name] = { size: data.length, md5: md5(data) };
    totalBytes += data.length;
  };
  const names = [];
  const collect = (root, prefix) => {
    if (!fs.existsSync(root)) return;
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const absoluteEntry = path.join(root, entry.name);
      const relativeEntry = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) collect(absoluteEntry, relativeEntry);
      else if (entry.isFile()) names.push(relativeEntry);
    }
  };
  for (const directory of ['src', 'res', 'branding']) collect(path.join(appRoot, directory), directory);
  for (const name of names.sort()) {
    if (name === manifestAsset) continue;
    const sourceFile = path.resolve(appRoot, name);
    if (!sourceFile.startsWith(`${appRoot}${path.sep}`) || !fs.existsSync(sourceFile)) {
      throw new Error(`${platform} 安装包缺少清单资源：${name}`);
    }
    let data = fs.readFileSync(sourceFile);
    if (name === 'src/project.jsc') data = patchProject(data);
    data = patchQjshzAsset(name, data);
    writeAsset(name, data);
  }
  // 分享二维码和朋友圈海报属于内容资产，不能只依赖输入安装包里的旧副本。
  // 每次热更都从当前品牌源覆盖，确保整包、Android/iOS 热更指向同一下载页。
  writeAsset('res/raw-assets/20/206b229f-fa1c-409e-b47e-b2d2c0938d57.png',
    encryptCocosImage(shareSources.downloadQr), true);
  writeAsset('res/raw-assets/db/dbd4ba35-fdeb-4a79-a26f-1f3ba1fdfca9.jpg',
    fs.readFileSync(shareSources.momentsPoster), true);
  // 俱乐部首页使用独立的明文 JPG 资源。每次热更都从当前
  // 品牌源覆盖，避免从旧安装包生成新版本时恢复旧背景。
  writeAsset('res/raw-assets/d7/d784bb4c-e6d9-4a94-932a-4b9bc139c351.jpg',
    fs.readFileSync(clubHomeBackground), true);
  // 3D 干瞪眼桌面不能从旧安装包回填；Android 与 iOS 共用同一资源槽位，
  // iOS 源图额外保留中央东南西北灯盘。
  writeAsset('res/raw-assets/0e/0ed69516-3023-4cb0-947a-abd9aab04b9f.jpg',
    encryptCocosImage(tableBackground3d[platform]), true);
  // 旧位图字体把桌面底色烘焙进了字形矩形；换桌面后会留下深色字块。
  // 新图集移除旧底色并改为透明浅米金字，确保玩法说明在新桌面上清晰。
  writeAsset('res/raw-assets/a1/a120356e-9147-4a68-a7ef-f9c4dbbaff41.png',
    encryptCocosImage(tableText3d), true);
  // 麻将牌墙升起前会先显示四条动画底座。原资源为蓝色，与新的绿色
  // 干瞪眼桌面不协调；强制覆盖 81 张原位动画纹理，只改色相，不改
  // 尺寸、透明通道、帧坐标或动画节奏。
  const paiDunGreenManifest = JSON.parse(fs.readFileSync(
    path.join(paiDunGreenRoot, 'manifest.json'), 'utf8',
  ));
  if (!Array.isArray(paiDunGreenManifest) || paiDunGreenManifest.length !== 81) {
    throw new Error('绿色牌墙升起动画清单异常');
  }
  for (const frame of paiDunGreenManifest) {
    if (!/^res\/raw-assets\/[0-9a-f]{2}\/[0-9a-f]{9}\.png$/i.test(frame.asset)) {
      throw new Error(`绿色牌墙升起动画路径异常：${frame.asset}`);
    }
    writeAsset(frame.asset, encryptCocosImage(path.join(paiDunGreenRoot, frame.asset)), true);
  }
  // 与操作按钮相同，牌面图集由正式源码强制覆盖，不依赖输入安装包。
  for (const [name, atlas] of qjshzPokerAtlases) {
    writeAsset(name, encryptCocosImage(atlas.source), true);
  }
  const textureUuid = qjshzBusyExit.textureUuid;
  const spriteUuid = qjshzBusyExit.spriteUuid;
  writeAsset(`res/raw-assets/${textureUuid.slice(0, 2)}/${textureUuid}.png`,
    encryptCocosImage(qjshzSources.busyExit), true);
  writeAsset(`res/import/${textureUuid.slice(0, 2)}/${textureUuid}.json`, Buffer.from(JSON.stringify({
    __type__: 'cc.Texture2D', content: '0,9729,9729,33071,33071,0,0,1',
  })), true);
  writeAsset(`res/import/${spriteUuid.slice(0, 2)}/${spriteUuid}.json`, Buffer.from(JSON.stringify({
    __type__: 'cc.SpriteFrame',
    content: {
      name: 'btn_exit_busy', texture: qjshzBusyExit.texturePackedUuid,
      rect: [0, 0, 309, 95], offset: [0, 0], originalSize: [309, 95], capInsets: [0, 0, 0, 0],
    },
  })), true);
  const packageUrl = `${BASE_URL}/hot-update/${platform}/${VERSION}/`;
  const project = {
    packageUrl,
    remoteManifestUrl: `${packageUrl}project.manifest`,
    remoteVersionUrl: `${packageUrl}version.manifest`,
    version: String(VERSION),
    assets,
    searchPaths: [],
  };
  const versionManifest = {
    packageUrl: project.packageUrl,
    remoteManifestUrl: project.remoteManifestUrl,
    remoteVersionUrl: project.remoteVersionUrl,
    version: project.version,
  };
  fs.writeFileSync(path.join(destination, 'project.manifest'), JSON.stringify(project));
  fs.writeFileSync(path.join(destination, 'version.manifest'), JSON.stringify(versionManifest));
  console.log(`${platform}: ${Object.keys(assets).length} 个资源，${(totalBytes / 1048576).toFixed(1)} MB`);
  return { archive: absolute, assetCount: Object.keys(assets).length, totalBytes };
};

try {
  for (const source of Object.values(qjshzSources)) {
    if (!fs.existsSync(source)) throw new Error(`缺少说胡子热更新素材：${source}`);
  }
  for (const [name, atlas] of qjshzPokerAtlases) {
    if (!fs.existsSync(atlas.source)) throw new Error(`缺少潜江千分牌面图集：${name}`);
    const actual = md5(fs.readFileSync(atlas.source));
    if (actual !== atlas.checksum) throw new Error(`潜江千分牌面图集校验失败：${name}`);
  }
  for (const source of Object.values(shareSources)) {
    if (!fs.existsSync(source)) throw new Error(`缺少分享热更新素材：${source}`);
  }
  if (!fs.existsSync(clubHomeBackground)) {
    throw new Error(`缺少俱乐部首页背景：${clubHomeBackground}`);
  }
  for (const [platform, source] of Object.entries(tableBackground3d)) {
    if (!fs.existsSync(source)) throw new Error(`缺少 ${platform} 3D 桌面背景：${source}`);
  }
  if (!fs.existsSync(path.join(paiDunGreenRoot, 'manifest.json'))) {
    throw new Error(`缺少绿色牌墙升起动画：${paiDunGreenRoot}`);
  }
  const published = {};
  if (ANDROID) published.android = publishPlatform('android', ANDROID);
  if (IOS) published.ios = publishPlatform('ios', IOS);

  const packages = path.join(stage, 'packages');
  fs.mkdirSync(packages);
  const config = { schemaVersion: 1, publishedAt: Date.now(), platforms: {} };
  const rollout = () => ({
    enabled: !FULL_RELEASE,
    percentage: FULL_RELEASE ? 100 : 0,
    includeUids: [],
    includeDeviceIds: [],
    excludeUids: [],
    excludeDeviceIds: [],
    salt: crypto.randomBytes(12).toString('hex'),
  });
  if (published.android) {
    const name = `qianjiang-gandengyan-${PACKAGE_VERSION}.apk`;
    fs.copyFileSync(published.android.archive, path.join(packages, name));
    config.platforms.android = {
      enabled: true,
      latestAssetVersion: VERSION,
      stableAssetVersion: FULL_RELEASE ? VERSION : STABLE_VERSION,
      rollout: rollout(),
      minimumPackageVersion: PACKAGE_VERSION,
      packageAction: 2,
      packageUrl: `${BASE_URL}/hot-update/packages/${name}`,
      packageName: name,
      packageDescription: '发现新版本，请升级后继续游戏。',
    };
  }
  if (published.ios) {
    const name = `qianjiang-gandengyan-${PACKAGE_VERSION}.ipa`;
    fs.copyFileSync(published.ios.archive, path.join(packages, name));
    const plistUrl = `${BASE_URL}/hot-update/packages/ios-install.plist`;
    const plist = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>items</key><array><dict><key>assets</key><array><dict><key>kind</key><string>software-package</string><key>url</key><string>${BASE_URL}/hot-update/packages/${name}</string></dict></array><key>metadata</key><dict><key>bundle-identifier</key><string>com.haoke.gandengyan</string><key>bundle-version</key><string>${PACKAGE_VERSION}</string><key>kind</key><string>software</string><key>title</key><string>潜江干瞪眼</string></dict></dict></array></dict></plist>`;
    fs.writeFileSync(path.join(packages, 'ios-install.plist'), plist);
    config.platforms.ios = {
      enabled: true,
      latestAssetVersion: VERSION,
      stableAssetVersion: FULL_RELEASE ? VERSION : STABLE_VERSION,
      rollout: rollout(),
      minimumPackageVersion: PACKAGE_VERSION,
      packageAction: 1,
      packageUrl: `itms-services://?action=download-manifest&url=${encodeURIComponent(plistUrl)}`,
      packageName: name,
      packageDescription: '发现新版本，请升级后继续游戏。',
    };
  }
  fs.writeFileSync(path.join(stage, 'hot-update.json'), `${JSON.stringify(config, null, 2)}\n`);
  fs.writeFileSync(path.join(stage, 'release.json'), `${JSON.stringify({
    version: VERSION, packageVersion: PACKAGE_VERSION, baseUrl: BASE_URL,
    git: gitInfo,
    platforms: Object.fromEntries(Object.entries(published).map(([key, value]) => [key, {
      assetCount: value.assetCount, totalBytes: value.totalBytes,
    }])),
  }, null, 2)}\n`);
  fs.renameSync(stage, output);
  if (!argv.includes('--skip-prune')
      && path.dirname(output) === path.join(ROOT, 'dist')
      && path.basename(output) === `hot-update-${VERSION}`) {
    const pruned = pruneLocal({ distRoot: path.join(ROOT, 'dist'), apply: true });
    console.log(`自动清理旧发布产物：${pruned.hot.length + pruned.pwa.length + pruned.work.length} 项`);
  }
  console.log(`完成：${output}`);
  console.log(FULL_RELEASE ? `发布方式：全量，版本 ${VERSION}`
    : `发布方式：灰度待验证，稳定版 ${STABLE_VERSION}，候选版 ${VERSION}，默认 0%`);
} catch (error) {
  fs.rmSync(stage, { recursive: true, force: true });
  throw error;
} finally {
  fs.rmSync(work, { recursive: true, force: true });
}
