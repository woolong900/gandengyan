#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'assets');
const uuidPaths = new Map();

function collectUuids(value, file) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectUuids(item, file));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value.uuid === 'string') {
    const paths = uuidPaths.get(value.uuid) || new Set();
    paths.add(file);
    uuidPaths.set(value.uuid, paths);
  }
  Object.values(value).forEach((item) => collectUuids(item, file));
}

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(file);
      continue;
    }
    if (!entry.name.endsWith('.meta')) continue;
    try {
      collectUuids(JSON.parse(fs.readFileSync(file, 'utf8')), file);
    } catch (_) {
      // Other project diagnostics already report malformed metadata.
    }
  }
}

visit(root);
const duplicates = [...uuidPaths.entries()]
  .filter(([, files]) => files.size > 1)
  .sort(([left], [right]) => left.localeCompare(right));

console.log(`重复 UUID：${duplicates.length}`);
for (const [uuid, files] of duplicates) {
  console.log(uuid);
  for (const file of files) console.log(`  ${path.relative(path.dirname(root), file)}`);
}
