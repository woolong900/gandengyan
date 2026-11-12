const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const harness=require('./local-poker-harness'),{ClubPokerRound}=require('../server/club-poker-round'),rules=require('../server/club-poker-rules');
const root='cocos-client/assets/Script/Recovered/';
const clone=v=>JSON.parse(JSON.stringify(v));
for(const game of ['DDZ','GD']){
 const type=game==='DDZ'?23:25,count=type===23?3:4,param1=type===23?1011:1101001,config=rules.parse(type,param1,0);
 const seats=Array.from({length:count},(_,pos)=>({player:{uid:100+pos,nickname:'测试'+pos},score:0}));
 const table={gameType:type,step:1,roomId:123456,param1,param2:0,num:1,hostUid:100,host:{now:()=>100000}};
 const io={table,all(){},one(){},each(){},over(){}};
 for(let hand=1;hand<=3;hand++){
  table.step=hand;let round=new ClubPokerRound(seats,{config},io);round.start();
  const expected=[];
  for(let n=0;!round.over&&n<1500;n++){
   if(n===5)round=ClubPokerRound.restore(clone(round.dump()),seats,io,config);
   assert.equal(round.autoPlay(round.current()),null);
   expected.push(clone(round.hands));
  }
  assert.ok(round.over);
  const raw=round.tape.finish(),tape=JSON.parse(raw.gameInfo.extend);
  assert.equal(tape.frames.length,expected.length,'one frame per accepted action, including restored prefix');
  for(let viewer=0;viewer<count;viewer++){
   const h=harness(game,{ids:config.ids});h.local.start(h.config);
   h.room.isPlayback=()=>true;h.room.myAbsolutePos=()=>viewer;h.load('UserData').default.uid=100+viewer;
   h.load('gContext').default.gameLogic=()=>new (h.load('GameLogic'+game).default)();
   const update=h.room.updatePlayerData.bind(h.room);
   h.room.updatePlayerData=function(data){update(data);for(const p of h.players){p.setSelfLevel=function(v){this.selfLevel=v;};p.setFriend=function(v){this.friendTeam=v;};}};
   h.room.updatePlayerData(seats.map((m,pos)=>({uid:m.player.uid,pos,score:0,gender:1})));
   function Base(){}Base.prototype.parse=function(){};Base.prototype.recordCountDown=function(){};
   Base.prototype.updateScore=function(uid,total){h.room.players.getByUid(uid).updateScore(total);};
   const parsed={};
   vm.runInNewContext(fs.readFileSync(root+'AnalysisMsg'+game+'.js','utf8'),{
    exports:parsed,module:{exports:parsed},cc:{_RF:{push(){},pop(){}},log(){},error(){}},setTimeout(){},
    require(n){n=n.replace('./','');if(n==='AnalysisMsgBase')return {default:Base};if(n===game+'GameControl')return {default:{getInstance:()=>({playAnimationBegin(){throw Error('replay must not enter live deal');}})}};if(n==='GameSoundDDZ')return h.load('GameSound'+game);return h.load(n);}
   });
   const parser=new parsed.default(),adapter={};
   vm.runInNewContext(fs.readFileSync(root+'PlaybackDataClubPoker.js','utf8'),{exports:adapter,
    require(n){n=n.replace('./','');if(n==='AnalysisMsg')return {default:{getInstance:()=>parser}};
     if(n==='PlaybackData'+game)return {default:{setData(){},begin(){}}};return h.load(n);}
   });
   h.room.config.category=()=>type;
   const replay=adapter.default;replay.setData(raw,'test');replay.begin();
   for(let i=0;i<replay.count();i++){
    replay.step(i);
    for(let p=0;p<count;p++)assert.deepEqual(Array.from(h.room['gameInfo'+game].siteInfos.get(p).handCards).sort((a,b)=>a-b),expected[i][p].slice().sort((a,b)=>a-b),`${game} replay hand ${hand} frame ${i} viewer ${viewer} seat ${p}`);
   }
   assert.equal(replay.count(),expected.length);
   replay.begin();
   for(let p=0;p<count;p++)assert.equal(h.room['gameInfo'+game].siteInfos.get(p).handCards.length,raw.gameInfo.sites[p].handCards.length,'restart restores dealt hands');
  }
 }
 console.log('PASS '+game+' packet replay / all perspectives / three hands / tribute / restart / every-frame hand identity');
}
const flow=require('../cocos-client/assets/Script/Recovered/PokerNetworkFlow');
const seen=[],parser={parse(h,d){seen.push([h,d]);}};
const done=flow.begin(parser);
assert.equal(flow.route(parser,'game_step',{card:[1,31,31]}),true);
assert.equal(seen.length,0);done();done();assert.equal(seen.length,1,'one completion flush');
const stale=flow.begin(parser);flow.route(parser,'game_pass',{});flow.route(parser,'game_info',{});stale();
assert.equal(seen.length,1,'reconnect supersedes queued visuals');
console.log('PASS network animation queue / one-shot completion / reconnect cancellation');
