#!/usr/bin/env node
/**
 * 把解出来的 `project.js` 拆回一个个模块文件，并还原原始目录树。
 *
 * 这个 bundle 是 browserify 风格的具名模块表：
 *   window.__require = function(...){...}({ ModuleName: [ function(e,t,o){…}, {依赖表} ], … }, {}, [入口])
 * 依赖表长这样 `"../../Common/CommonEnum": "CommonEnum"`——键是**原始相对路径**，
 * 所以只要给一个模块定个位置，顺着依赖就能把整棵目录树推回来。
 *
 * 边界不能按行切：`}, {` 在函数体里也出现，数目对不上（647 vs 667）。走 AST。
 *
 * usage: node tools/splitbundle.js [<project.js> [<输出目录>]]
 */
const fs = require('fs');
const path = require('path');
// tools/ 自己没有 node_modules，借 game/ 里 vite 带的 rollup（SWC 内核，3.4MB 也很快）
const { createRequire } = require('module');
const { parseAst } = createRequire(path.join(__dirname, '..', 'game', 'package.json'))('rollup/parseAst');

const SRC = process.argv[2] || '/tmp/qjqp/out/js/project.js';
const OUT = process.argv[3] || '/tmp/qjqp/out/src';

const src = fs.readFileSync(SRC, 'utf8');
const ast = parseAst(src);

/** 找 `window.__require = <call>(…)`，第一个实参就是模块表 */
function findModuleTable(program) {
  for (const stmt of program.body) {
    const expr = stmt.type === 'ExpressionStatement' && stmt.expression;
    if (!expr || expr.type !== 'AssignmentExpression') continue;
    if (expr.right.type !== 'CallExpression') continue;
    const table = expr.right.arguments[0];
    if (table && table.type === 'ObjectExpression') return table;
  }
  return null;
}

const table = findModuleTable(ast);
if (!table) {
  console.error(`${SRC} 里没找到 window.__require 的模块表`);
  process.exit(1);
}

const keyOf = (k) => (k.type === 'Identifier' ? k.name : k.value);

/** name -> { body: 源码, deps: Map<相对路径, 模块名> } */
const mods = new Map();
for (const prop of table.properties) {
  const [fn, deps] = prop.value.elements;
  const body = src.slice(fn.body.start + 1, fn.body.end - 1).replace(/^\n+|\n+$/g, '');
  const d = new Map();
  for (const p of deps.properties) d.set(keyOf(p.key), p.value.value);
  mods.set(keyOf(prop.key), { body, deps: d });
}

// 从一个模块的位置推它依赖的位置。相对路径可能向上走出起点，所以先垫一截虚拟前缀，
// 最后再把没人命名的那几层剥掉。
const PAD = 24;
const seed = [...Array(PAD)].map((_, i) => `\u0000${i}`);
const dir = new Map();

/** 解析 `../../Common/CommonEnum` 相对 from 的所在目录 */
function resolveDir(from, rel) {
  const out = from.slice();
  for (const p of rel.split('/').slice(0, -1)) {
    if (p === '.' || p === '') continue;
    if (p === '..') {
      if (!out.length) return null; // 垫的层数不够，放弃这一条
      out.pop();
    } else out.push(p);
  }
  return out;
}

// 依赖表里同一个模块会被很多人以不同相对路径引用，全都指向同一处，所以从任一模块出发
// 广度优先铺开即可。先从引用最多的模块起（它多半在树的中间），剩下的孤岛各自再起一个种子。
function spreadFrom(start) {
  dir.set(start, seed);
  const queue = [start];
  while (queue.length) {
    const name = queue.shift();
    const here = dir.get(name);
    for (const [rel, dep] of mods.get(name).deps) {
      if (!mods.has(dep) || dir.has(dep)) continue;
      const d = resolveDir(here, rel);
      if (!d) continue;
      dir.set(dep, d);
      queue.push(dep);
    }
  }
}

const fanout = [...mods].sort((a, b) => b[1].deps.size - a[1].deps.size);
for (const [name] of fanout) if (!dir.has(name)) spreadFrom(name);

// `./X` 说明双方同目录，可以把没定位到的引用者拉过来
for (let changed = true; changed; ) {
  changed = false;
  for (const [name, m] of mods) {
    if (dir.has(name)) continue;
    for (const [rel, dep] of m.deps) {
      if (rel.startsWith('./') && !rel.slice(2).includes('/') && dir.has(dep)) {
        dir.set(name, dir.get(dep));
        changed = true;
        break;
      }
    }
  }
}

// 剥掉开头那些没人命名的垫层
const placed = [...dir.values()];
let strip = 0;
while (placed.every((d) => d[strip] && d[strip].startsWith('\u0000'))) strip++;

fs.rmSync(OUT, { recursive: true, force: true });
let unplaced = 0;
for (const [name, m] of mods) {
  const d = dir.get(name);
  if (!d) unplaced++;
  const rel = d ? d.slice(strip).filter((s) => !s.startsWith('\u0000')) : ['_未定位'];
  const dst = path.join(OUT, ...rel, `${name}.js`);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const head = [...m.deps].map(([r, dep]) => ` *   ${r} -> ${dep}`).join('\n');
  fs.writeFileSync(dst, `/**\n * ${name}\n${head ? ` *\n * 依赖：\n${head}\n` : ''} */\n${m.body}\n`);
}

console.log(`${mods.size} 个模块 -> ${OUT}${unplaced ? `（${unplaced} 个没定位，放在 _未定位/）` : ''}`);
