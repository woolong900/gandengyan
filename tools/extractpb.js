#!/usr/bin/env node
/**
 * 把客户端的 `Network/pb.js` 和 `Network/protocol.js` 抽出来给服务端直接用。
 *
 * 不反推 `.proto` 再重新生成——那样两边的编解码就成了两份实现，字段号、
 * oneof、默认值任何一处对不上都要靠联调才发现。客户端这份是 protobufjs
 * **静态生成**的，直接拿来当服务端的编解码器，编码差异的风险归零。
 *
 * 拆出来的模块体签名是 `(e, t, o)` = (require, module, exports)，
 * 外加 Cocos 的 `cc._RF.push/pop` 打点，所以要垫一个 cc 桩。
 *
 * usage: node tools/extractpb.js [<拆包目录> [<输出目录>]]
 */
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2] || '/tmp/qjqp/out/src/Network';
const OUT = process.argv[3] || path.join(__dirname, '..', 'server', 'proto');

/** 模块名 -> 它的 `e("…")` 该解析到哪 */
const MODULES = {
  pb: { 'protobufjs/minimal': 'protobufjs/minimal' },
  protocol: { './pb': './pb' },
};

const wrap = (name, body, deps) => `/**
 * 由 tools/extractpb.js 从原版客户端抽出，请勿手改。
 * 源：assets/src/project.jsc -> Network/${name}.js
 */
'use strict';
const cc = { _RF: { push() {}, pop() {} }, error: console.error, log() {} };
const DEPS = ${JSON.stringify(deps, null, 2)};

module.exports = (function () {
  const t = { exports: {} };
  const o = t.exports;
  const e = (id) => {
    const target = DEPS[id];
    if (!target) throw new Error('未映射的依赖: ' + id);
    return require(target);
  };
${body}
  return t.exports;
})();
`;

fs.mkdirSync(OUT, { recursive: true });
for (const [name, deps] of Object.entries(MODULES)) {
  const raw = fs.readFileSync(path.join(SRC, `${name}.js`), 'utf8');
  // 去掉 splitbundle 加的文件头注释
  const body = raw.replace(/^\/\*\*[\s\S]*?\*\/\n/, '');
  const dst = path.join(OUT, `${name}.js`);
  fs.writeFileSync(dst, wrap(name, body, deps));
  console.log(`${dst}  ${fs.statSync(dst).size} 字节`);
}
