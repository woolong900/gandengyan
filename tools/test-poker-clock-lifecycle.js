const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

for (const game of ['DDZ', 'GD']) {
  const status = {Gameing: 2, JiaoDiZhu: 1, gongpai: 3, SingleEnd: 4};
  const rounds = {Turn: 1, JiaoDiZhu: 2, gongpai: 3, Null: 0};
  const count = game === 'DDZ' ? 3 : 4;
  const sites = Array.from({length: count}, () => ({roundType: rounds.Null}));
  const info = {status: status.Gameing, siteInfos: {get: pos => sites[pos]}};
  const room = {['gameInfo' + game]: info, getCountDown: () => 15};
  const enums = {['e' + game + 'GameStatus']: status, ['eRoundType' + game]: rounds};
  const output = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,
    '../cocos-client/assets/Script/Recovered/' + game + 'PosClockCtr.js'), 'utf8'), {
    module: {exports: output}, exports: output,
    require: name => name === './RoomInfoData' ? {default: room}
      : name === './' + game + 'Enum' ? enums : {default: {}},
    cc: {_RF: {push(){}, pop(){}}, Component: function(){}, Node: function(){}, Label: function(){},
      _decorator: {ccclass: c => c, property: () => () => {}}}
  });
  let rowActive = false, rowWrites = 0;
  const row = {get active(){return rowActive;}, set active(value){rowWrites++;rowActive=value;}};
  const views = sites.map((site, pos) => {
    const view = new output.default();
    view.posCtr = {uiPos: pos, deskPos: () => pos};
    view.buttonRoot = row;
    view.timeLabel = {enabled: false, node: {active: false}, string: '', setVertsDirty(){}};
    let active = false;
    view.rootNode = {get active(){return active;}, set active(value){
      if (value) {
        assert.equal(view.timeLabel.string, '15', 'digits must be ready before exposing the clock');
        assert.equal(view.timeLabel.node.active, true);
      }
      active = value;
    }};
    view.scheduled = [];
    view.scheduleOnce = callback => view.scheduled.push(callback);
    view.unschedule = callback => { view.scheduled = view.scheduled.filter(c => c !== callback); };
    return view;
  });

  // Robot turn changes used to toggle the local row off/on, including GD's
  // nested self clock. No opponent may touch that row, even on a delayed reset.
  for (const view of views.slice(1)) {
    const writes = rowWrites;
    view._reset(); view.lateUpdate();
    assert.equal(rowWrites, writes, 'opponent must not toggle the shared local UI');
    info.b_isDelay_time = true; view._reset(true);
    view.scheduled[0](); view.lateUpdate();
    assert.equal(rowWrites, writes, 'delayed opponent reset must not resurrect local UI');
  }

  // Coalesce turn updates until after button/layout updates, in the same frame.
  info.b_isDelay_time = false;
  const self = views[0]; sites[0].roundType = rounds.Turn;
  self._reset();
  assert.equal(self.rootNode.active, false);
  assert.equal(rowActive, false);
  self.lateUpdate();
  assert.equal(self.rootNode.active, true);
  assert.equal(rowActive, true);
  sites[0].roundType = rounds.Null;
  self._reset();
  sites[0].roundType = rounds.Turn;
  self._reset();
  sites[0].roundType = rounds.Null;
  self._reset(); self.lateUpdate();
  assert.equal(self.rootNode.active, false, 'transient turn must never be painted');

  // A newer event supersedes a bomb/animation delay; stale callbacks are inert.
  info.b_isDelay_time = true;
  self._reset(true); const obsolete = self.scheduled[0];
  info.b_isDelay_time = false;
  self._reset(); self.lateUpdate();
  assert.equal(self.scheduled.length, 0);
  obsolete();
  assert.equal(self._clockDirty, false);
  const writes = rowWrites;
  self.lateUpdate(); assert.equal(rowWrites, writes);

  sites[0].roundType = rounds.Turn;
  info.status = status.SingleEnd;
  self._reset(); self.lateUpdate();
  assert.equal(self.rootNode.active, false, 'settlement cannot expose a stale turn clock');
  info.b_isDelay_time = true;
  self._reset(true); const destroyed = self.scheduled[0];
  self.onDestroy(); destroyed();
  assert.equal(self._pendingClockReset, null);
  assert.equal(self._clockDirty, false);
}
console.log('PASS DDZ/GD: only self owns action row; frame-coalesced clock activation; digits ready before show; stale delayed reset and destroyed callbacks ignored');
