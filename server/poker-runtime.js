'use strict';
// Isolated, renderer-free execution of the same audited poker rules used by
// the local client. Each table owns its models; no browser/player globals leak
// across rooms. Only server-authorized actions enter this runtime.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { randomInt } = require('node:crypto');
const sources = new Map();
const root = path.join(__dirname, '../cocos-client/assets/Script/Recovered');
const clone = value => JSON.parse(JSON.stringify(value));
function hydrate(target, saved) {
  for (const [key, value] of Object.entries(saved)) {
    if (value && !Array.isArray(value) && typeof value === 'object' && target[key]) hydrate(target[key], value);
    else target[key] = value;
  }
}
function createRuntime(game, config, seats, now) {
  const cache = {}, players = [], storage = new Map(), events = [];
  let actor = 0, end = null;
  const ids = new Set(config.ids);
  const cell = {index:game === 'DDZ' ? 23 : 25, isChecked:id=>ids.has(id),
    getValue:()=>config.底分, gameCount:()=>1000000, peopleCount:()=>seats.length};
  const user = {uid:seats[0].player.uid, nickname:'', get second(){return Math.floor(now()/1000);}};
  function player(data) {return Object.assign({}, data, {
    isDouble:data.isdouble || 1, isReady(){return this.ready;}, isOnLine(){return true;},
    pbData(){return {...this};}, updateScore(value){this.score=value;}
  });}
  const room = {roomId:0, config:cell, isPlayback:()=>false, myAbsolutePos:()=>actor,
    myPlayerData:()=>players[actor], setCountDown(value){this._countDown=value;},
    getCountDown(){return Math.max(0,this._countDown-user.second);},
    reset(){players.length=0;delete this['gameInfo'+game];},
    setTotalEndData(){},getTotalEndData(){return null;},
    players:{getByPos:pos=>players[pos],getByUid:uid=>players.find(p=>p.uid===uid)},
    updatePlayerData(data){[].concat(data).forEach(p=>players[p.pos]=player(p));},
    updateGameData(data){const key='gameInfo'+game;if(!this[key])this[key]=new (load(game+'GameInfoData').default)();this[key].update(data);}
  };
  const sound = new Proxy({}, {get:()=>()=>{}});
  const mocks = {
    RoomInfoData:{default:room},UserData:{default:user},
    gContext:{default:{eventUtils:{emit:(...args)=>events.push(args)},uiHelper:{showTip(){}},msgBox:{showOnlyOk(){}}}},
    ['GameSound'+game]:{default:{getInstance:()=>sound}},SoundUtils:{default:{pokerVoiceDelay:()=>0}},
    ['GDMyRoundTipCtr']:{SetTipIndex(){}},['DDZMyRoundTipCtr']:{SetTipIndex(){}},
    [game+'SingleEndData']:{default:{getInstance:()=>({update(data){end=clone(data);}})}},
    PokerDealFlow:{begin(adapter,done){done();},cancel(){}},
    PokerLocalTiming:{schedule(){}},
  };
  const math=Object.create(Math);math.random=()=>randomInt(0,0x100000000)/0x100000000;
  function load(name) {
    if(mocks[name])return mocks[name];if(cache[name])return cache[name];
    if(!/^[A-Za-z0-9_]+$/.test(name))throw Error('Invalid poker module');
    if(!sources.has(name))sources.set(name,fs.readFileSync(path.join(root,name+'.js'),'utf8'));
    const exports={};cache[name]=exports;
    vm.runInNewContext(sources.get(name),{module:{exports},exports,require:n=>load(n.replace(/^\.\//,'')),
      Math:math,cc:{_RF:{push(){},pop(){}},log(){},error(){},sys:{isBrowser:false,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}}},
      setTimeout(){},console:{log(){}}},{filename:name,timeout:5000});
    return exports;
  }
  const local=load(game+'Standalone').default;
  local.start(cell);
  // Protobuf room/record scores are integers; DDZ supports 1.5/2.5 bases.
  room.scoreRatio=10;
  if(game==='DDZ')local._baseScore=config.底分*room.scoreRatio;
  room.updatePlayerData(seats.map((member,pos)=>({uid:member.player.uid,pos,score:member.score||0,
    name:member.player.nickname,gender:member.player.sex||1,ready:true,onLine:true})));
  local._warningVoice=()=>{};
  const runtime={local,room,players,load,events,
    setActor(pos){actor=pos;user.uid=players[pos].uid;},
    info(){return room['gameInfo'+game];},
    end(){return end;},
    deal(step, match){events.length=0;local._roundNo=step-1;if(match)Object.assign(local,clone(match));local._deal();
      this.antiTribute=events.some(e=>e[0]==='kanggong_anim_play');events.length=0;},
    dump(){const state={};for(const key of Object.keys(local))if(typeof local[key]!=='function')state[key]=local[key];
      return clone({state,info:this.info(),players:players.map(p=>p.pbData()),end,antiTribute:!!this.antiTribute});},
    restore(raw){local._deal();Object.assign(local,clone(raw.state));room.roomId=local._roomId;hydrate(this.info(),clone(raw.info));
      room.updatePlayerData(clone(raw.players));end=clone(raw.end);
      if(local._tributeTasks)for(const task of local._tributeTasks)task.pair=local._tributePairs.find(p=>p.from===task.pair.from&&p.to===task.pair.to);
      this.antiTribute=!!raw.antiTribute;events.length=0;}
  };
  return runtime;
}
module.exports={createRuntime};
