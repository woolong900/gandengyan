process.env.QJQP_FILLBOTS='0';
const assert=require('node:assert/strict');
const {GameApp}=require('../server/app');
const {protocol}=require('../server/proto/protocol');
function pack(proto,data){const d=protocol[proto],p=d.cs?Buffer.from(d.cs.encode(d.cs.create(data||{})).finish()):Buffer.alloc(0),b=Buffer.alloc(12+p.length);b.writeUInt32BE(proto);b.writeUInt32BE(b.length,8);p.copy(b,12);return b;}
for(const type of [23,25,24]){
  const app=new GameApp({persist(){},now:()=>100000,allowUnregisteredTokens:true});
  const boxes=[],players=[];
  const count=type===23?3:type===25?4:5;
  function send(i,p,d){app.onMessage('c'+i,pack(p,p===200?{json:JSON.stringify(d)}:d));return last(i,p);}
  function last(i,p){return boxes[i].filter(x=>x.p===p).at(-1)?.d;}
  for(let i=0;i<count;i++){
    boxes[i]=[];app.attach('c'+i,b=>{const p=b.readUInt32BE(0),def=protocol[p].sc;boxes[i].push({p,d:def.toObject(def.decode(b.subarray(12)),{longs:Number,defaults:true})});});
    send(i,100,{token:'poker-'+type+'-'+i});players[i]=app.conns.get('c'+i).player;players[i].cardNum=1000;
  }
  const created=send(0,147,{name:'扑克联机回归'+type}),clubId=Number(created.id);assert.equal(created.res.error,0);
  for(let i=1;i<count;i++){
    assert.equal(send(i,117,{code:String(clubId)}).res.error,0);
    const pending=send(0,137,{clubId}).data.find(x=>Number(x.userId||x.uid)===players[i].uid)||last(0,137).data.at(-1);
    assert.equal(send(0,138,{id:pending.id}).res.error,0);
  }
  const params={clubId,gameType:type,num:1,param1:type===25?1101001:type===24?35:1001,param2:0};
  assert.notEqual(send(1,149,params).res.error,0,'ordinary members cannot add schemes');
  assert.equal(send(0,149,params).res.error,0,'save scheme');
  const scheme=send(0,124,{clubId}).data[0];
  assert.equal(send(0,150,{...params,id:scheme.id,name:'联机测试',color:'0'}).res.error,0,'edit scheme');
  assert.equal(send(0,151,{id:scheme.id,status:true}).res.error,0);
  const roomId=Number(send(0,122,{clubId}).rooms[0].id);
  for(let i=0;i<count;i++)assert.equal(send(i,202,{roomId}).res.error,0,'join');
  const table=app.tables.get(roomId);
  assert.equal(table.round,null,'must ready before deal');
  for(let i=0;i<count;i++)assert.equal(send(i,200,{msghead:'gameready',msgdata:'{}'}).res.error,0,'ready');
  assert.ok(table.round);assert.equal(table.step,1);
  const round=table.round;
  for(let i=0;i<count;i++){
    const data=send(i,202,{roomId});assert.equal(data.res.error,0);
    const game=JSON.parse(JSON.parse(data.json).msgdata).game;
    if(type!==24)assert.ok(game.players.filter(x=>x.uid!==players[i].uid).every(x=>!x.card.hand_card.length));
  }
  assert.notEqual(send((round.current()+1)%count,200,{msghead:'gameguo',msgdata:'{}'}).res.error,0,'reject out of turn');
  const restored=new GameApp({persist(){},now:()=>100000,allowUnregisteredTokens:true});
  restored.restore(JSON.parse(JSON.stringify(app.dump())));
  const restoredTable=restored.tables.get(roomId);
  assert.ok(restoredTable.round,'persist active game');
  assert.deepEqual(JSON.parse(JSON.stringify(restoredTable.round.snapshot(0))),JSON.parse(JSON.stringify(round.snapshot(0))),'restart snapshot');
  for(let turn=0;table.round&&turn<1500;turn++)assert.equal(table.round.autoPlay(table.round.current()),null);
  assert.equal(table.round,null,'settlement waits for ready');assert.equal(table.hands.length,1);
  for(let i=0;i<count;i++)send(i,200,{msghead:'gameready',msgdata:'{}'});
  assert.equal(table.step,2);assert.ok(table.round,'next round');
  for(let turn=0;table.round&&turn<1500;turn++)assert.equal(table.round.autoPlay(table.round.current()),null,'round 2 / tribute');
  assert.equal(table.round,null);assert.equal(table.hands.length,2);
  for(let i=0;i<count;i++)send(i,200,{msghead:'dissmissroom',msgdata:'{}'});
  assert.ok(table.closed,'dissolve room');
  for(const hand of table.hands){
    const pb=send(0,127,{id:hand.id});
    assert.equal(pb.res.error,0,'authorized replay via real protobuf');
    const tape=JSON.parse(pb.gameInfo.extend);
    assert.equal(tape.format,'qj-club-poker-v1');
    assert.equal(tape.frames.length,pb.steps.length);
    assert.ok(tape.frames.at(-1).some(p=>p.head==='game_end'),'replay includes settlement');
    assert.ok(pb.gameInfo.sites.every(s=>s.handCards.length>0),'initial hands persisted');
  }
  const saved=new GameApp({persist(){},now:()=>100000,allowUnregisteredTokens:true});
  saved.restore(JSON.parse(JSON.stringify(app.dump())));
  assert.deepEqual(saved.records[0].playbacks,app.records[0].playbacks,'replay survives restart');
  boxes[count]=[];app.attach('c'+count,b=>{const p=b.readUInt32BE(0),def=protocol[p].sc;boxes[count].push({p,d:def.toObject(def.decode(b.subarray(12)),{longs:Number,defaults:true})});});
  send(count,100,{token:'unrelated-viewer-'+type});
  assert.notEqual(send(count,127,{id:table.hands[0].id}).res.error,0,'outsiders cannot retrieve revealed hands');
  console.log('PASS club protocol save/edit/permissions/auto-table/join/ready/reconnect/restart/two rounds/dissolve',type);
}
process.exit(0);
