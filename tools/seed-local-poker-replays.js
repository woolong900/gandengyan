// Local UI acceptance fixtures. Intentionally refuses project/production DBs.
const path=require('node:path');
const filename=path.resolve(process.env.QJQP_DB||'');
if(!/^\/tmp\/qjqp-club-[^/]+\/state\.sqlite$/.test(filename))throw Error('Only an explicit /tmp/qjqp-club-*/state.sqlite test database is allowed');
const store=require('../server/store'),{ClubPokerRound}=require('../server/club-poker-round');
const rules=require('../server/club-poker-rules'),{buildRecord}=require('../server/records');
(async()=>{
 await store.backup(filename+'.before-replays-'+Date.now());
 const state=store.load(),user=state.players.find(p=>Number(p.uid)===285633);
 if(!user)throw Error('Expected local test account missing');
 for(const type of [23,25,24]){
  const param1=type===23?1011:type===25?1101001:35,config=rules.parse(type,param1,0);
  const members=Array.from({length:config.人数},(_,pos)=>({player:pos===0?user:{uid:990000+pos,nickname:'回放测试'+pos},score:0,ready:true}));
  const table={gameType:type,roomId:900000+type,clubId:158934,hostUid:user.uid,param1,param2:0,num:1,
   members,hands:[],gameRules:{RATIO:type===24?1:10},host:{now:()=>Date.now()}};
  for(let step=1;step<=3;step++){
   table.step=step;let result;
   const round=new ClubPokerRound(members,{config},{table,all(){},one(){},each(){},over:r=>result=r});round.start();
   for(let n=0;!round.over&&n<1500;n++)if(round.autoPlay(round.current()))throw Error('Fixture did not progress');
   if(!round.over)throw Error('Incomplete fixture');
   table.hands.push({id:String(table.roomId)+String(step).padStart(2,'0')+'999',playback:round.tape.finish(),
    scores:members.map((m,s)=>({uid:m.player.uid,score:result.scores[s]}))});
  }
  state.records.push(buildRecord(table,Date.now()));
  console.log('Seeded local replay',type,table.hands.map(h=>h.id));
 }
 store.save(state);store.close();
})().catch(e=>{console.error(e);store.close();process.exitCode=1;});
