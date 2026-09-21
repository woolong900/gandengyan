# iOS R234 基线

原厂公开下载页在 2026-09-15 仍提供 `ios/1.0/qjqp.ipa`。下载文件与本项目保存的 `originals/ios/qjqp-original-ios-1.0.2.ipa` SHA-256 相同：`2c9c4f09537d8a097b8037159c1ac4139cac4857425bf26e988d07d4b45dacb2`。它的 `Info.plist` 应用版本为 1.0，分发 `plist` 标注为 1.0.2，内置 Cocos 清单版本为 189，脚本里的资源断言版本为 108。公开版本接口当前要求更新到 R234。

原厂 iOS R234 热更新清单来自 `http://hotupgrade.yuanlaihuyu.com/qjqp/update/234/project.manifest`，保存为 `originals/ios/qjqp-r234-project.manifest`。其 8563 个文件的 MD5 与缓存的原厂 Android R234 APK 里同路径文件全部一致。因此默认 iOS 构建使用原厂 iOS 原生壳、当前已修补 R234 APK 中的跨平台 Cocos 资源，以及 `tools/build-ios-ipa.js` 里的 iOS 专用原生桥接。应用的显示版本 1.0.6（构建号 235）是本项目的热更新引导版，不代表原厂完整 IPA 已升级。

构建脚本会检查清单列出的文件路径，并按最终资源重新生成本地 R235 清单。`--cocos-base ios` 仅用于对照旧内置资源；正常构建默认使用 R234 资源并写入 R235 引导基线。原厂原生壳仍来自 1.0.2 分发包，真机上的画面、登录和微信回调仍需在指定测试设备上验证。
