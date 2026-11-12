const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const plain = value => JSON.parse(JSON.stringify(value));
const cache = {
  CommonUtils: {default: {clone: plain}},
  gContext: {default: {eventUtils: {emit() {}}}},
  EventKeys: {default: {}}
};
function load(name) {
  if (cache[name]) return cache[name];
  const module = {exports: {}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../cocos-client/assets/Script/Recovered', name + '.js'), 'utf8'), {
    module, exports: module.exports,
    require: dep => load(dep.replace('./', '')),
    cc: {_RF: {push() {}, pop() {}}, error: message => {throw Error(message);}}
  }, {filename: name});
  return cache[name] = module.exports;
}
const Cell = load('RoomConfigCellData').default;
for (const index of [23, 25]) {
  const retired = index === 23 ? [5, 6, 7] : [5, 6, 50, 51];
  const defaults = new Cell(Cell.defData(index));
  const visible = defaults.sortTypes().flatMap(type => defaults.sortIds(type));
  assert.ok(retired.every(id => !visible.includes(id)));
  assert.ok(!defaults.sortTypes().includes('4'), 'fixed mode row must not leave empty space');
  assert.equal(defaults.peopleCount(), index === 23 ? 3 : 4);
  assert.ok(defaults.isChecked(4));
  for (const oldMode of index === 23 ? [5, 6, 7] : [5, 6]) {
    const old = {index, ipLimit: 1, ids: [2, 12, 18, oldMode, 22, 43, 200], other: {15: 3}};
    if (index === 25) old.ids.push(50, 51);
    const before = plain(old), cell = new Cell(old);
    assert.deepEqual(old, before, 'do not mutate caller storage');
    for (const id of retired) {
      assert.equal(cell.isChecked(id), false);
      cell.onClicked(id);
      assert.equal(cell.isChecked(id), false, 'stale UI cannot re-enable retired mode');
    }
    assert.ok(cell.isChecked(4));
    assert.equal(cell.peopleCount(), index === 23 ? 3 : 4);
    assert.equal(cell.storageData().ipLimit, 1);
    assert.equal(cell.getValue(15), 3);
    assert.ok([2, 12, 22, 43, 200].every(id => cell.storageData().ids.includes(id)));
    assert.ok(retired.every(id => !cell.storageData().ids.includes(id)));
    if (index === 25) assert.ok(cell.isChecked(53));
    const restored = new Cell(plain(cell.storageData()));
    assert.deepEqual(plain(restored.storageData()), plain(cell.storageData()), 'migration is idempotent');
  }
}
const upgrade = new Cell({index: 25, ids: [4, 4, 18, 54]});
assert.equal(upgrade.isChecked(54), true);
assert.equal(upgrade.isChecked(53), false);
assert.equal(upgrade.storageData().ids.filter(id => id === 4).length, 1);
assert.ok(!upgrade.sortTypes().includes('10'), 'retired rotating-level controls are hidden');
for (const index of [2, 24]) {
  const old = {index, ids: [5, 6, 7], other: {15: 3}};
  assert.deepEqual(plain(new Cell(old).storageData()), old, 'unrelated games must be untouched');
}
console.log('PASS: supported room options, legacy migration, stale clicks, saved settings, four-seat classic and unrelated games');
