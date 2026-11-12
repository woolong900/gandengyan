// Real loopback sockets and protobuf frames; isolated in-memory fixtures only.
process.env.QJQP_FILLBOTS='0';
const assert=require('node:assert/strict'),{once}=require('node:events');
const {WebSocket,WebSocketServer}=require('ws');
const {GameApp}=require('../server/app'),{protocol}=require('../server/proto/protocol');
function pack(id,data){const def=protocol[id].cs,p=Buffer.from(def.encode(def.create(data)).finish()),b=Buffer.alloc(12+p.length);b.writeUInt32BE(id);b.writeUInt32BE(b.length,8);p.copy(b,12);return b;}
async function main(){
for(const type of [23,25,24]){
  const app=new GameApp({persist(){},allowUnregisteredTokens:true});
  const wss=new WebSocketServer({host:'127.0.0.1',port:0});await once(wss,'listening');
  let next=0;const clients=[];
  wss.on('connection',ws=>{const id='c'+next++;app.attach(id,b=>ws.send(b));ws.on('message',b=>app.onMessage(id,b));ws.on('close',()=>app.detach(id));});
  function send(i,id,data){return new Promise((resolve,reject)=>{
    const ws=clients[i],timer=setTimeout(()=>{ws.off('message',receive);reject(Error('response timeout '+id));},5000);
    function receive(b){if(b.readUInt32BE(0)!==id)return;clearTimeout(timer);ws.off('message',receive);const def=protocol[id].sc;resolve(def.toObject(def.decode(b.subarray(12)),{longs:Number,defaults:true}));}
    ws.on('message',receive);ws.send(pack(id,id===200?{json:JSON.stringify(data)}:data));
  });}
  try{
    const count=type===23?3:type===25?4:5;
    for(let i=0;i<count;i++){clients[i]=new WebSocket('ws://127.0.0.1:'+wss.address().port);await once(clients[i],'open');assert.equal((await send(i,100,{token:'ws-poker-'+type+'-'+i})).res.error,0);}
    const club=await send(0,147,{name:'本地套接字回归'+type}),clubId=Number(club.id);
    assert.equal(club.res.error,0);
    for(let i=1;i<count;i++){
      assert.equal((await send(i,117,{code:String(clubId)})).res.error,0);
      const pending=await send(0,137,{clubId});assert.equal((await send(0,138,{id:pending.data.at(-1).id})).res.error,0);
    }
    assert.equal((await send(0,149,{clubId,gameType:type,num:1,param1:type===25?1101001:type===24?35:1001,param2:0})).res.error,0);
    const schemes=await send(0,124,{clubId});assert.equal((await send(0,151,{id:schemes.data[0].id,status:true})).res.error,0);
    const rooms=await send(0,122,{clubId}),roomId=Number(rooms.rooms[0].id);
    for(let i=0;i<count;i++)assert.equal((await send(i,202,{roomId})).res.error,0);
    const table=app.tables.get(roomId);assert.equal(table.round,null);
    for(let hand=1;hand<=2;hand++){
      for(let i=0;i<count;i++)assert.equal((await send(i,200,{msghead:'gameready',msgdata:'{}'})).res.error,0);
      assert.ok(table.round);
      for(let n=0;table.round&&n<1500;n++){
        const round=table.round,seat=round.current(),handle=round.handleAction;let request;
        // Ask the production policy to choose, but deliver the chosen action
        // over the player's WebSocket rather than applying it directly.
        round.handleAction=(s,head,body)=>{request={msghead:head,msgdata:JSON.stringify(body)};return null;};
        try{round.autoPlay(seat);}finally{round.handleAction=handle;}
        assert.ok(request);const reply=await send(seat,200,request);assert.equal(reply.res.error,0,reply.res.what);
        if(n===4){const reconnect=await send(seat,202,{roomId});assert.equal(reconnect.res.error,0);}
      }
      assert.equal(table.round,null);assert.equal(table.hands.length,hand);
    }
    for(let i=0;i<count;i++)await send(i,200,{msghead:'dissmissroom',msgdata:'{}'});
    assert.ok(table.closed);
    console.log('PASS real WebSocket club save / '+count+' peers / ready / two hands / reconnect / dissolve:',type);
  }finally{for(const ws of clients)ws.terminate();await new Promise(resolve=>wss.close(resolve));}
}
}
main().then(()=>process.exit(0),e=>{console.error(e);process.exit(1);});
