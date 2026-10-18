#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { git, releaseGitInfo } = require('./release-git');

const args = process.argv.slice(2);
const index = args.indexOf('--version');
const version = Number(index >= 0 ? args[index + 1] : args[0]);
if (!Number.isSafeInteger(version) || version < 1) throw new Error('请提供有效的 --version');

const ROOT = path.join(__dirname, '..');
const releaseFile = path.join(ROOT, 'dist', `hot-update-${version}`, 'release.json');
if (!fs.existsSync(releaseFile)) throw new Error(`缺少 R${version} 发布产物：${releaseFile}`);

const info = releaseGitInfo(ROOT);
if (!info.commit) throw new Error('当前目录不是可用的 Git 仓库');
if (info.dirty) throw new Error('工作区不是干净状态；请先审阅并提交本次发布改动');

const tag = `release-r${version}`;
let existing = '';
try { existing = git(ROOT, ['rev-list', '-n', '1', tag]); } catch {}
if (existing && existing !== info.commit) throw new Error(`${tag} 已指向其他提交 ${existing}`);
if (!existing) git(ROOT, ['tag', '-a', tag, '-m', `潜江干瞪眼 R${version}`]);

const release = JSON.parse(fs.readFileSync(releaseFile, 'utf8'));
release.git = {
  commit: info.commit,
  tag,
  taggedAt: new Date().toISOString(),
};
fs.writeFileSync(releaseFile, `${JSON.stringify(release, null, 2)}\n`);
console.log(`已标记 ${tag} -> ${info.shortCommit}`);
