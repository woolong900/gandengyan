const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Engine=require('../cocos-client/assets/Script/TDak/TDakLocalEngine');
const {ClubPokerRound}=require('../server/club-poker-round'),rules=require('../server/club-poker-rules');
const config=rules.parse(24,35,0),count=5;
const seats=Array.from({length:count},(_,pos)=>({player:{uid:100+pos,nickname:'测试'+pos},score:0,ready:true}));
const io={table:{gameType:24,step:1,host:{now:()=>Date.now()}},each(){},all(){},over(){}};
const round=new ClubPokerRound(seats,{config},io);round.start();
for(let viewer=0;viewer<count;viewer++){
  const sent=[],room={roomId:123456,config:{peopleCount:()=>count,isChecked:id=>config.ids.includes(id)},
    myAbsolutePos:()=>viewer,tdakSnapshotRoomId:123456,tdakSnapshot:round.snapshot(viewer),
    players:{getByPos:pos=>({name:'测试'+pos,isReady:()=>true})}};
  let methods;
  vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/TDak/TDakStandalone.js','utf8'),{
    cc:{Color:function(){},Component:function(){},Class:obj=>{methods=obj;}},
    require:name=>name.endsWith('TDakLocalEngine')?Engine:name.endsWith('RoomInfoData')?{default:room}:{default:{}}
  });
  const view=Object.assign({_network:true,_sendNetwork:(head,data)=>sent.push({head,data})},methods);
  view._syncNetworkGame();
  assert.equal(view.game.players[0].uid,100+viewer);
  assert.deepEqual(Array.from(view.game.players[0].cards,c=>c.code),round.hands[viewer].map(c=>c.code));
  assert.equal(view.game.currentChair,(round.current()-viewer+count)%count);
  assert.ok(view.game.players.slice(1).every(p=>p.cards.filter(c=>!c.open).every(c=>c.code===0)));
  view._sendNetwork=(head,data)=>sent.push({head,data});
  const before=JSON.stringify(view.game);
  view._start();view._takeAction(Engine.ACTION.FOLLOW,0);
  assert.deepEqual(sent.map(x=>x.head),['gameready','tdak_action']);
  assert.equal(JSON.stringify(view.game),before,'client must not independently deal or settle a network hand');
  view._playback=true;view._sendNetwork=methods._sendNetwork;
  view._start();view._takeAction(Engine.ACTION.FOLLOW,0);
  assert.equal(sent.length,2,'replay cannot send ready or action requests');
  room.tdakSnapshot=null;view._syncNetworkGame();
  assert.equal(view.game.state,'waiting');assert.equal(view.game.currentChair,-1);
}
console.log('PASS TDak five perspectives / private cards / authoritative ready and action / waiting room');

// Replay the actual persisted server tape through the TDak parser, then rotate
// it through every viewer. No server-only cards can disappear during playback.
while(!round.over)assert.equal(round.autoPlay(round.current()),null);
const raw=round.tape.finish(),tape=JSON.parse(raw.gameInfo.extend);
for(let viewer=0;viewer<count;viewer++){
 const room={roomId:123456,config:{category:()=>24,peopleCount:()=>count},myAbsolutePos:()=>viewer,
   setPaybackData(data){this.roomId=data.roomId;this.config=data.config;},
   players:{getByPos:pos=>({name:'测试'+pos,isReady:()=>true})}};
 const ctx={gameLogic:()=>({roomParam2Config:()=>room.config}),eventUtils:{emit(){}}};
 function Base(){}Base.prototype.parse=function(){};Base.prototype.cleanReady=function(){};
 const parserModule={},adapterModule={};
 vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/AnalysisMsgTDak.js','utf8'),{exports:parserModule,
   require:n=>({default:n.endsWith('RoomInfoData')?room:n.endsWith('gContext')?ctx:Base})});
 const parser=new parserModule.default();
 vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/PlaybackDataClubPoker.js','utf8'),{exports:adapterModule,
   require:n=>({default:n.endsWith('RoomInfoData')?room:n.endsWith('gContext')?ctx:{getInstance:()=>parser}})});
 let methods;
 vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/TDak/TDakStandalone.js','utf8'),{
   cc:{Color:function(){},Component:function(){},Class:obj=>{methods=obj;}},
   require:n=>n.endsWith('TDakLocalEngine')?Engine:{default:n.endsWith('RoomInfoData')?room:ctx}});
 const view=Object.assign({},methods),replay=adapterModule.default;
 replay.setData(raw,'test');replay.begin();
 for(let i=-1;i<replay.count();i++){
   if(i>=0)replay.step(i);
   view._syncNetworkGame();
   const snapshot=i<0?tape.initial:tape.frames[i].filter(p=>['game_info','game_begin','game_end'].includes(p.head)).at(-1).data;
   for(let p=0;p<count;p++)assert.deepEqual(Array.from(view.game.players[(p-viewer+count)%count].cards,c=>c.code),snapshot.tdak.players[p].cards.map(c=>c.code));
 }
 assert.equal(view.game.state,'ended');
 replay.begin();view._syncNetworkGame();assert.equal(view.game.state,tape.initial.tdak.state);
}
console.log('PASS TDak full tape / all five perspectives / every-frame cards / settlement / replay restart / read-only actions');
