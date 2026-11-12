// Renderer-free harness using the production card rules, seat and game models.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
module.exports = function harness(game, opts = {}) {
  const root = path.join(__dirname, '../cocos-client/assets/Script/Recovered');
  const cache = {}, storage = new Map(), queue = [], events = [], tips = [], summaries = [], sounds = [];
  let seed = opts.seed || 37;
  const math = Object.create(Math);
  math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  const ids = new Set(opts.ids || (game === 'DDZ' ? [4,16,21] : [4,24,53]));
  const config = { index: game === 'DDZ' ? 23 : 25, isChecked: id => ids.has(id),
    getValue: id => id === 15 ? (opts.base || 1) : 0, gameCount: () => opts.rounds || 4, peopleCount: () => game === 'DDZ' ? 3 : 4 };
  const players = [];
  function player(data) { return Object.assign({}, data, {isDouble:data.isdouble || 1,
    isReady(){return this.ready;}, isOnLine(){return true;}, pbData(){return {...this};},
    updateScore(score){this.score=score;}
  }); }
  const room = { roomId:0, config, isPlayback:()=>false, myAbsolutePos:()=>0,
    setCountDown(end){this._countDown=end;},getCountDown(){return Math.max(0,this._countDown-mocks.UserData.default.second);},
    reset(){players.length=0;this._totalEndData=null;delete this['gameInfo'+game];}, leaveRoom(){this.roomId=0;}, myPlayerData:()=>players[0],
    setTotalEndData(data){this._totalEndData=data;},getTotalEndData(){return this._totalEndData;},
    players:{getByPos:pos=>players[pos],getByUid:uid=>players.find(p=>p.uid===uid)},
    updatePlayerData(data){[].concat(data).forEach(p=>players[p.pos]=player(p));},
    updateGameData(data){
      const key='gameInfo'+game;
      if(!this[key])this[key]=new (load(game+'GameInfoData').default)();
      this[key].update(data);
    }
  };
  const context = { eventUtils:{emit:(...args)=>events.push(args)},
    uiHelper:{showTip:t=>tips.push(t)}, msgBox:{showOnlyOk:(text,ok)=>summaries.push({text,ok})} };
  const sound = {};
  for (const method of ['put','pass','jiaoDiZhu','warningOnly','gameWin','gameLose'])
    sound[method] = (...args) => sounds.push([method,...args]);
  const mocks = { ['GameSound'+game]:{default:{getInstance:()=>sound}},
    SoundUtils:{default:{pokerVoiceDelay:()=>0}},
    RoomInfoData:{default:room}, UserData:{default:{uid:1,nickname:'测试玩家',second:1000}},
    gContext:{default:context}, GDMyRoundTipCtr:{SetTipIndex(){}}, DDZMyRoundTipCtr:{SetTipIndex(){}} };
  function load(name) {
    if(mocks[name])return mocks[name]; if(cache[name])return cache[name];
    const exports={};cache[name]=exports;
    vm.runInNewContext(fs.readFileSync(path.join(root,name+'.js'),'utf8'), {
      module:{exports},exports,require:n=>load(n.replace('./','')),Math:math,
      cc:{_RF:{push(){},pop(){}},log(){},error:console.error,sys:{isBrowser:true,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}}},
      console:{log(){}},setTimeout:fn=>queue.push(fn)
    },{filename:name});
    return exports;
  }
  const local=load(game+'Standalone').default, rules=load(game+'CardUtils').default;
  const dealCallbacks=[], dealFlow=load('PokerDealFlow');
  const dealView={scheduleOnce:fn=>fn(),play:done=>opts.manualDeal?dealCallbacks.push(done):done()};
  dealFlow.attach(local,dealView);
  return {local,rules,room,players,queue,events,tips,summaries,sounds,load,config,ids,dealCallbacks,dealView,dealFlow};
};
