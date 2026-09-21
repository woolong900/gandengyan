#!/usr/bin/env node
/** Assemble the editable recovered modules back into one CommonJS bundle. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROJECT = path.resolve(process.argv[2] || path.join(ROOT, 'client-cocos-recovered'));
const OUTPUT = process.argv[3] && path.resolve(process.argv[3]);
if (!OUTPUT) throw new Error('用法：build-recovered-bundle.js <project> <output.js>');

const report = path.join(PROJECT, 'recovery-report');
const graph = JSON.parse(fs.readFileSync(path.join(report, 'module-graph.json'), 'utf8'));
const originalModules = graph.modules;
const entries = graph.entries;
const moduleMap = JSON.parse(fs.readFileSync(path.join(report, 'module-map.json'), 'utf8'));
const scripts = path.join(PROJECT, 'assets', 'Script', 'Recovered');

const records = [];
for (const [name, originalDependencies] of Object.entries(originalModules)) {
  const filename = moduleMap[name];
  if (!filename) throw new Error(`模块没有源码映射：${name}`);
  const file = path.join(scripts, `${filename}.js`);
  let body = fs.readFileSync(file, 'utf8');
  body = body.replace(/^\/\/ Recovered from the production CommonJS bundle\.\r?\n/, '');
  body = body.replace(/^var e = require, t = module, o = exports;\r?\n/, '');

  const dependencies = { ...originalDependencies };
  for (const target of Object.values(originalDependencies || {})) {
    const targetName = moduleMap[String(target)];
    if (targetName) dependencies[`./${targetName}`] = target;
  }
  records.push(`${JSON.stringify(name)}:[function(e,t,o){\nvar require=e,module=t,exports=o;\n${body}\n},${JSON.stringify(dependencies)}]`);
}

// 恢复的模块依赖图中有些依赖保留了完整相对路径，而打包后的
// 模块表使用文件名作为 key。命中 basename 回退时必须同步更新 a，
// 否则下一句仍会访问不存在的 t[a][0]，导致整个 project.js 停止加载。
const output = `window.__require=function e(t,o,n){function r(a,s){if(!o[a]){if(!t[a]){var l=a.split("/");l=l[l.length-1];if(!t[l]){var c="function"==typeof __require&&__require;if(!s&&c)return c(l,!0);if(i)return i(l,!0);throw new Error("Cannot find module '"+a+"'")}a=l}var u=o[a]={exports:{}};t[a][0].call(u.exports,function(e){return r(t[a][1][e]||e)},u,u.exports,e,t,o,n)}return o[a].exports}for(var i="function"==typeof __require&&__require,a=0;a<n.length;a++)r(n[a]);return r}({\n${records.join(',\n')}\n},{},${JSON.stringify(entries)});\n`;
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, output);
console.log(`已生成完整恢复脚本包：${records.length} 个模块，${entries.length} 个入口。`);
