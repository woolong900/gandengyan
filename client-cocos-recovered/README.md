# 潜江干瞪眼 Cocos Creator 恢复工程

该工程从已发布 APK 恢复，目标版本为 **Cocos Creator 2.1.3**。

## 当前恢复内容

- 9 个场景
- 2602 个可映射资源及 397 个构建期依赖资源
- 2527 个 SpriteFrame 裁剪与 UUID 映射
- 669 个拆分后的 JavaScript 模块
- 图片、音频、字体、Prefab、动画和 JSON 的原逻辑路径
- 原脚本模块名、依赖关系和序列化组件 ID

## 打开方式

1. 安装 Cocos Creator 2.1.3。
2. 用 Creator 打开本目录，等待 Library 完成首次导入。
3. 首次打开场景时，从 assets/resources/Hall/Scene/LoginScene.fire 开始。

## 恢复限制

脚本是从发布包拆分出的 ES5 JavaScript，无法恢复原 TypeScript、注释和原始目录层级。场景与 Prefab 来自构建后的序列化数据，部分编辑器专用信息已经被发布流程裁剪。自动图集、位图字体和 DragonBones 已尽量转换为源格式，但仍需在 Creator 中逐项检查。Android 微信、语音和设备 ID 等原生桥接代码不属于 Cocos 资源，需另行迁移到原生构建模板。

当前机器没有安装 Cocos Creator 2.1.3，因此已完成静态语法、依赖和 UUID 一致性验证，但尚未完成 Creator 编辑器导入与重新构建验证。该目录是可继续整理的恢复工程，不应直接视为已经能够一键发布的原始工程。

详细统计见 recovery-report/summary.json。原始解密 bundle 和构建设置保存在 recovery-report 中，便于对照。
