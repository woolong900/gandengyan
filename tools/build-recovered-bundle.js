#!/usr/bin/env node
/** Assemble the editable recovered modules back into one CommonJS bundle. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROJECT = path.resolve(process.argv[2] || path.join(ROOT, 'client-release-source'));
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
  // Hand-maintained recovered modules can gain a dependency that was not in
  // the immutable production graph (for example the local GuanDan room
  // adapter).  Preserve the original numeric mappings, then add basename
  // fallbacks for any newly introduced CommonJS requests.
  for (const match of body.matchAll(/require\((['"])([^'"]+)\1\)/g)) {
    const request = match[2];
    if (!Object.prototype.hasOwnProperty.call(dependencies, request)) {
      dependencies[request] = path.basename(request);
    }
  }
  records.push(`${JSON.stringify(name)}:[function(e,t,o){\nvar require=e,module=t,exports=o;\n${body}\n},${JSON.stringify(dependencies)}]`);
}

// The recovered bundle replaces Creator's generated main script. Register the
// imported TDak scripts explicitly so SceneTDak can resolve its serialized
// component without replacing the original login and hall entry modules.
const extraModules = [
  ['TDakLocalEngine', 'fab780NXthGh6++PPDUioIR', {}],
  ['TDakStandalone', '03916CjiNsVK0LboD7Ezgur', {
    './TDakLocalEngine': 'TDakLocalEngine',
    '../Recovered/gContext': 'gContext',
  }],
];
for (const [name, scriptId, dependencies] of extraModules) {
  const file = path.join(PROJECT, 'assets', 'Script', 'TDak', `${name}.js`);
  if (!fs.existsSync(file)) continue;
  const body = fs.readFileSync(file, 'utf8');
  for (const match of body.matchAll(/require\((['"])([^'\"]+)\1\)/g)) {
    dependencies[match[2]] = path.basename(match[2]);
  }
  const wrapped = `cc._RF.push(t,${JSON.stringify(scriptId)},${JSON.stringify(name)});\n${body}\ncc._RF.pop();`;
  records.push(`${JSON.stringify(name)}:[function(e,t,o){\nvar require=e,module=t,exports=o;\n${wrapped}\n},${JSON.stringify(dependencies)}]`);
}

// r234 of the original Qianjiang client shipped a complete GuanDan module,
// while the later source package used for this recovery omitted it.  Restored
// GD scripts keep their original cc._RF ids and flattened CommonJS imports;
// include them without replacing any newer shared host module.
const gdModuleNames = fs.readdirSync(scripts)
  .filter((filename) => /^(?:GD.*|DDZStandalone|PokerActionButtonStyle|PokerClockStyle|PokerDealFlow|PokerNetworkFlow|PokerLocalTiming|PokerSettlementStyle|GameLogicGD|GameLogicTDak|AnalysisMsgTDak|GameSoundGD|GameMsgGD|AnalysisMsgGD|PlaybackDataGD|PlaybackDataClubPoker)\.js$/.test(filename))
  .map((filename) => path.basename(filename, '.js'))
  .filter((name) => !Object.prototype.hasOwnProperty.call(originalModules, name))
  .sort();
for (const name of gdModuleNames) {
  const file = path.join(scripts, `${name}.js`);
  let body = fs.readFileSync(file, 'utf8');
  body = body.replace(/^\/\/ Recovered from the production CommonJS bundle\.\r?\n/, '');
  body = body.replace(/^var e = require, t = module, o = exports;\r?\n/, '');
  const dependencies = {};
  for (const match of body.matchAll(/require\((['"])([^'"]+)\1\)/g)) {
    const request = match[2];
    dependencies[request] = path.basename(request);
  }
  records.push(`${JSON.stringify(name)}:[function(e,t,o){\nvar require=e,module=t,exports=o;\n${body}\n},${JSON.stringify(dependencies)}]`);
}

let runtimeEntries = fs.existsSync(path.join(PROJECT, 'assets', 'Script', 'TDak', 'TDakStandalone.js'))
  ? entries.concat('TDakStandalone')
  : entries;
runtimeEntries = runtimeEntries.concat(gdModuleNames);

// 恢复的模块依赖图中有些依赖保留了完整相对路径，而打包后的
// 模块表使用文件名作为 key。命中 basename 回退时必须同步更新 a，
// 否则下一句仍会访问不存在的 t[a][0]，导致整个 project.js 停止加载。
const output = `window.__require=function e(t,o,n){function r(a,s){if(!o[a]){if(!t[a]){var l=a.split("/");l=l[l.length-1];if(!t[l]){var c="function"==typeof __require&&__require;if(!s&&c)return c(l,!0);if(i)return i(l,!0);throw new Error("Cannot find module '"+a+"'")}a=l;if(o[a])return o[a].exports}var u=o[a]={exports:{}};t[a][0].call(u.exports,function(e){return r(t[a][1][e]||e)},u,u.exports,e,t,o,n)}return o[a].exports}for(var i="function"==typeof __require&&__require,a=0;a<n.length;a++)r(n[a]);return r}({\n${records.join(',\n')}\n},{},${JSON.stringify(runtimeEntries)});\n`;
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, output);
console.log(`已生成完整恢复脚本包：${records.length} 个模块，${runtimeEntries.length} 个入口。`);
