# 客户端正式发布源

这里只保留 Android 整包、iOS 整包和热更新共用的脚本及必需资源。

它不是 Cocos Creator 工程，不包含 `project.json`、`settings`、`library`、`temp` 等工程或缓存目录。完整的 Cocos Creator 2.4.13 恢复工程位于 `../cocos-client`；正式发布脚本仍只读取本目录，不会隐式混用两套来源。
