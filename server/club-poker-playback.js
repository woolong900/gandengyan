'use strict';
const {maxStep}=require('./shared');
const clone=value=>JSON.parse(JSON.stringify(value));
// The existing protobuf has an opaque gameInfo.extend field. Versioned packet
// tapes retain the original parsers/animations without inventing poker opcodes.
// Full hands exist only in the persisted tape, never in live broadcasts.
class ClubPokerTape {
  constructor(raw){
    this.head=raw?clone(raw.head):null;
    this.frames=raw?clone(raw.frames):[];
    this.pending=[];this.flushed=!!(raw&&raw.flushed);
  }
  begin(round){
    const table=round.io.table;
    this.head={players:round.seats.map((m,pos)=>({uid:m.player.uid,name:m.player.nickname||`玩家${m.player.uid}`,
      headImg:m.player.avatarUrl||'',pos,score:m.score||0,gender:m.player.sex===2?2:1,onLine:true,ready:true})),
      roomInfo:{type:table.gameType,roomId:table.roomId,house:table.hostUid,maxStep:maxStep(table),
        param1:table.param1,param2:table.param2,scoreRatio:table.gameType===24?1:10},
      gameInfo:{count:table.step,sites:round.hands.map((hand,pos)=>({pos,handCards:hand.map(c=>typeof c==='object'?c.code:c)}))},
      initial:round.snapshot(-1,{reveal:true})};
  }
  record(head,data){
    if(!this.head||this.flushed||head==='game_operator'||head==='game_friendhandcard')return;
    this.pending.push({head,data:clone(data)});
  }
  flush(){if(this.pending.length)this.frames.push(this.pending.splice(0));}
  finish(){
    if(!this.head)return null;
    this.flush();this.flushed=true;
    const {initial,...head}=clone(this.head);
    head.gameInfo.extend=JSON.stringify({format:'qj-club-poker-v1',initial,frames:this.frames});
    return {...head,steps:this.frames.map((_,index)=>({operates:[{uid:0,index:9000,cards:[index]}]}))};
  }
  dump(){this.flush();return {head:this.head,frames:this.frames,flushed:this.flushed};}
}
module.exports={ClubPokerTape};
