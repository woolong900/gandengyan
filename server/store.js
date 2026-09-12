/**
 * 把玩家和房间落到 data/state.json。写盘先写临时文件再 rename，避免写到一半崩了留下半份。
 */
const fs = require('fs');
const path = require('path');
const fsp = fs.promises;

const FILE = process.env.QJQP_STATE
  || path.join(__dirname, '..', 'data', 'state.json');

const empty = () => ({
  nextUid: 100001,
  nextRoomId: 100000,
  players: [],
  rooms: [],
  records: [],
  playbackSeq: 0,
});

const load = () => {
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return empty();
    return {
      nextUid: Number(data.nextUid) || 100001,
      nextRoomId: Number(data.nextRoomId) || 100000,
      players: Array.isArray(data.players) ? data.players : [],
      rooms: Array.isArray(data.rooms) ? data.rooms : [],
      records: Array.isArray(data.records) ? data.records : [],
      playbackSeq: Number(data.playbackSeq) || 0,
    };
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('读存档失败', err);
    return empty();
  }
};

const save = (data) => {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data));
  fs.renameSync(tmp, FILE);
};

const saveAsync = async (data) => {
  await fsp.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fsp.writeFile(tmp, JSON.stringify(data));
  await fsp.rename(tmp, FILE);
};

module.exports = { FILE, load, save, saveAsync };
