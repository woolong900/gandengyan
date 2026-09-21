# iOS 企业重签说明

- Bundle ID：`com.haoke.gandengyan`
- 微信 AppID：`wx296b8ef20e6de62f`
- Universal Link：`https://gmhiu.com/wechat/`
- Associated Domains：`applinks:gmhiu.com`

待签 IPA 已在 ad-hoc 签名权限中携带 `com.apple.developer.associated-domains`。企业重签时请：

1. 使用对应 `com.haoke.gandengyan` 的明确 App ID 和 provisioning profile。
2. 确保 profile 的 Entitlements 包含 `com.apple.developer.associated-domains`。
3. 重签时保留附带的 `qianjiang-gandengyan.entitlements`，不要删除 `applinks:gmhiu.com`。
4. 不要修改 Bundle ID，不要注入动态库或设备信息上报模块。

重签完成后，请先返回 IPA 进行签名权限复核，确认最终包仍包含：

```text
com.apple.developer.associated-domains = ["applinks:gmhiu.com"]
```
