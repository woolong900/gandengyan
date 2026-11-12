const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const harness=require('./local-poker-harness'),{ClubPokerRound}=require('../server/club-poker-round'),rules=require('../server/club-poker-rules');
for(const game of ['DDZ','GD']){
  const type=game==='DDZ'?23:25,count=type===23?3:4;
  const config=rules.parse(type,type===23?1011:1101001,0);
  const seats=Array.from({length:count},(_,pos)=>({player:{uid:pos+100,nickname:'测试'+pos},score:0}));
  const clients=seats.map((_,viewer)=>{
    const h=harness(game,{ids:config.ids});h.local.start(h.config);
    h.load('gContext').default.gameLogic=()=>new (h.load('GameLogic'+game).default)();
    h.room.myAbsolutePos=()=>viewer;
    h.load('UserData').default.uid=100+viewer;
    h.room.updatePlayerData(seats.map((m,pos)=>({uid:m.player.uid,pos,score:0,ready:true,gender:1})));
    const update=h.room.updatePlayerData.bind(h.room);
    h.room.updatePlayerData=function(data){update(data);for(const p of h.players){p.setSelfLevel=function(level){this.selfLevel=level;};p.setFriend=function(team){this.friendTeam=team;};}};
    h.room.updatePlayerData([]);
    function Base(){}
    Base.prototype.parse=function(){};
    Base.prototype.recordCountDown=function(){};
    Base.prototype.updateScore=function(uid,total){h.room.players.getByUid(uid).updateScore(total);};
    const out={},control={default:{getInstance:()=>({playAnimationBegin(first,done){if(typeof first==='function')first();else if(done)done();}})}};
    vm.runInNewContext(fs.readFileSync('cocos-client/assets/Script/Recovered/AnalysisMsg'+game+'.js','utf8'),{
      exports:out,module:{exports:out},cc:{_RF:{push(){},pop(){}},log(){},error:console.error},setTimeout(){},
      require(name){name=name.replace('./','');if(name==='AnalysisMsgBase')return {default:Base};if(name===game+'GameControl')return control;if(name==='GameSoundDDZ')return h.load('GameSound'+game);return h.load(name);}
    });
    return {h,parser:new out.default(),viewer};
  });
  let round;
  const emit=(c,head,data)=>c.parser.parse(head,JSON.parse(JSON.stringify(data)));
  const table={gameType:type,step:1,host:{now:()=>Date.now()}};
  const io={table,all:(h,d)=>clients.forEach(c=>emit(c,h,d)),one:(s,h,d)=>emit(clients[s],h,d),each:(h,fn)=>clients.forEach(c=>emit(c,h,fn(c.viewer))),over(){}};
  for(let handNo=1;handNo<=2;handNo++){
  const previousScores=seats.map(s=>s.score);
  table.step=handNo;
  round=new ClubPokerRound(seats,{config},io);round.start();
  for(let n=0;!round.over&&n<1500;n++){
    for(const {h,viewer} of clients)for(let p=0;p<count;p++){
      const hand=h.room['gameInfo'+game].siteInfos.get(p).handCards;
      assert.equal(hand.length,round.hands[p].length,game+' hand count');
      if(p===viewer)assert.deepEqual(Array.from(hand).sort((a,b)=>a-b),Array.from(round.hands[p]).sort((a,b)=>a-b),game+' private hand');
    }
    if(n%13===0){for(const c of clients){emit(c,'game_info',round.snapshot(c.viewer));emit(c,'game_operator',round.operator());}}
    assert.equal(round.autoPlay(round.current()),null);
  }
  assert.ok(round.over);
  if(game==='GD')assert.ok(seats.some((s,i)=>Math.abs(s.score-previousScores[i])>=10),'GD round score deltas use native tenths');
  }
  console.log('PASS actual native AnalysisMsg'+game+' consumes two multiplayer rounds / reconnect / tribute / settlement');
}
