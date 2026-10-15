# 潜江干瞪眼 Cocos Creator 恢复工程

该工程从已发布 APK 恢复，现已迁移并通过 **Cocos Creator 2.4.13** Android 构建验证。

## 当前恢复内容

- 9 个场景
- 2602 个可映射资源及 397 个构建期依赖资源
- 2527 个 SpriteFrame 裁剪与 UUID 映射
- 669 个拆分后的 JavaScript 模块
- 图片、音频、字体、Prefab、动画和 JSON 的原逻辑路径
- 原脚本模块名、依赖关系和序列化组件 ID
- Android 微信登录/分享、游客设备 ID、语音、剪贴板和系统能力桥接源码

## 打开方式

1. 安装 Cocos Creator 2.4.13。
2. 用 Creator 打开本目录，等待 Library 完成首次导入。
3. 首次打开场景时，从 assets/resources/Hall/Scene/LoginScene.fire 开始。

## 命令行构建

在仓库根目录执行 `npm run cocos:apk`。构建只读取 `cocos-client` 中的场景、资源、拆分脚本、模块依赖图和原生源码，不读取或合并旧 APK；生成的安装包会写入仓库根目录的 `dist`，并安装到所有在线 ADB 设备。

## 浏览器构建与运行

本机安装 Cocos Creator 2.4.13 后，可直接在仓库根目录执行统一命令：

```bash
npm run cocos:web:build
npm run cocos:web:serve
```

浏览器访问 `http://127.0.0.1:7456`。Web 构建输出在 `build/web-mobile`。
默认生成发布版本；如需 Creator 调试信息和 source map，可执行
`QJQP_WEB_DEBUG=true npm run cocos:web:build`。

Web 构建会同时生成 `manifest.webmanifest`、PWA 图标和 Service Worker；
部署到 `https://gandengyan.top/pwa/` 后可在 iPhone、iPad、Android 和
桌面浏览器中运行，并支持添加到主屏幕。

根目录通过 npm workspace 统一管理依赖和锁文件；本目录只保留 Cocos
Creator 必需的工程配置。发布品牌资源可执行 `npm run cocos:assets:sync`
同步，调试 APK 可执行 `npm run cocos:debug-apk` 构建。

浏览器版默认把 HTTP 接口映射到同源路径 `/__qjqp_api`，把 WebSocket
映射到 `/__qjqp_ws`。`web:serve` 会将它们代理到 `https://gmhiu.com`
和 `wss://gmhiu.com/ws`，因此本地调试不会触发浏览器 CORS 限制。

线上部署时可继续用相同路径配置 Nginx 反向代理；也可以在构建产物的
`web-config.js` 中把 `apiBase` 和 `websocketUrl` 改为已经允许 CORS 的地址。

## 恢复限制

脚本是从发布包拆分出的 ES5 JavaScript，无法恢复原 TypeScript、注释和原始目录层级。场景与 Prefab 来自构建后的序列化数据，部分编辑器专用信息已经被发布流程裁剪。自动图集、位图字体和 DragonBones 已转换为可导入的源资源；Android 原生桥接放在 `native/android/java`，构建脚本会复制到 Creator 生成的原生工程。

当前工程已经完成 Creator 导入、Android 编译、签名、安装和真机运行链路验证。`Games/dbd/Scene/SceneDBD.fire` 仍引用一个发布包中不存在的材质 UUID，这不影响当前潜江麻将登录、大厅和房间资源。

详细统计见 `recovery-report/summary.json`。构建使用 `module-graph.json` 还原 CommonJS 模块关系，拆分后的脚本可直接编辑。
