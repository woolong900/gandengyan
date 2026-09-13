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

在仓库根目录执行 `npm run apk:source`。构建只读取本工程的场景、资源、拆分脚本、模块依赖图和原生源码，不读取或合并旧 APK；生成的安装包会写入仓库的 `dist` 目录，并安装到所有在线 ADB 设备。

## 恢复限制

脚本是从发布包拆分出的 ES5 JavaScript，无法恢复原 TypeScript、注释和原始目录层级。场景与 Prefab 来自构建后的序列化数据，部分编辑器专用信息已经被发布流程裁剪。自动图集、位图字体和 DragonBones 已转换为可导入的源资源；Android 原生桥接放在 `native/android/java`，构建脚本会复制到 Creator 生成的原生工程。

当前工程已经完成 Creator 导入、Android 编译、签名、安装和真机运行链路验证。`Games/dbd/Scene/SceneDBD.fire` 仍引用一个发布包中不存在的材质 UUID，这不影响当前潜江麻将登录、大厅和房间资源。

详细统计见 `recovery-report/summary.json`。构建使用 `module-graph.json` 还原 CommonJS 模块关系，拆分后的脚本可直接编辑。
