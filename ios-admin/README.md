# 秘密武器 iOS

面向房间管理的横屏原生 iOS App。启动后使用服务端签发的受限设备令牌自动认证，只能读取房间、查看玩家手牌，以及设置或清除牌序。

首次构建前运行 `node scripts/generate-secrets.js`。生成的令牌文件和 Swift 配置已加入 `.gitignore`，不可提交。将 `.mobile-token` 中的同一令牌配置到服务端 `QJQP_ADMIN_MOBILE_TOKEN` 后即可使用。

在 Xcode 中打开 `SecretWeapon.xcodeproj`，选择自己的 Apple Developer Team 后可安装到真机。工程固定为 iPhone/iPad 横屏。
