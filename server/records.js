/**
 * 大厅战绩：一局房一场，明细按手。回放另说。
 */
const { maxStep } = require('./shared');
const rules = require('./rules');

const DAY_SEC = 86400;
const KEEP = 300;

const toListItem = (rec) => ({
  id: rec.id,
  gameId: rec.gameId,
  roomId: rec.roomId,
  gameCount: rec.gameCount,
  totalCount: rec.totalCount,
  param1: rec.param1,
  param2: rec.param2,
  time: rec.time,
  scoreRatio: rec.scoreRatio || rules.RATIO,
  players: rec.players || [],
});

const buildRecord = (table, now) => {
  const players = table.members.filter((m) => !m.view).map((m) => ({
    uid: m.player.uid,
    name: m.player.nickname,
    score: m.score || 0,
    avatarUrl: '',
    winner: false,
  }));
  const top = Math.max(0, ...players.map((p) => p.score));
  for (const p of players) p.winner = p.score === top && top > 0;

  let details = (table.hands || []).map((h) => ({
    id: h.id,
    scores: (h.scores || []).map((s) => ({ uid: s.uid, score: s.score })),
  }));
  if (!details.length && table.step > 0) {
    details = [{
      id: `${table.roomId}01`,
      scores: players.map((p) => ({ uid: p.uid, score: p.score })),
    }];
  }

  return {
    id: `R${table.roomId}${now}`,
    gameId: table.gameType,
    roomId: table.roomId,
    gameCount: details.length,
    totalCount: maxStep(table),
    param1: table.param1,
    param2: table.param2,
    time: now,
    scoreRatio: rules.RATIO,
    players,
    details,
    uids: players.map((p) => p.uid),
  };
};

const listFor = (records, uid, timeSec) => {
  const start = Number(timeSec) || 0;
  const from = start * 1000;
  const to = (start + DAY_SEC) * 1000;
  const me = Number(uid);
  return (records || [])
    .filter((r) => (r.uids || []).some((id) => Number(id) === me) && r.time >= from && r.time < to)
    .sort((a, b) => b.time - a.time)
    .map(toListItem);
};

const keepLatest = (records) => {
  if (!records || records.length <= KEEP) return records || [];
  return records.slice(records.length - KEEP);
};

module.exports = { buildRecord, listFor, toListItem, keepLatest, DAY_SEC, KEEP };
