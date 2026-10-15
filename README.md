# 潜江干瞪眼联机

本仓库统一保存服务端、正式客户端发布源和完整的 Cocos Creator 工程：

- `server/`：游戏与管理服务端。
- `client-release-source/`：Android、iOS 整包及热更新共用的正式发布源。
- `cocos-client/`：可用 Cocos Creator 2.4.13 打开的完整恢复工程。

依赖由根目录的 npm workspace 和单一 `package-lock.json` 管理。在根目录执行
`npm install` 即可安装全部依赖。

常用 Cocos 命令：

```bash
npm run cocos:apk
npm run cocos:debug-apk
npm run cocos:assets:sync
npm run cocos:web:build
npm run cocos:web:serve
```

`cocos:web:build` 会生成可安装的 PWA，线上地址为
`https://gandengyan.top/pwa/`。
下载页的 iPhone 入口也统一指向该 PWA。

更多 Cocos 工程说明见 `cocos-client/README.md`。
