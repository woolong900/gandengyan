"use strict";
var Base=require('./AnalysisMsgBase').default,Room=require('./RoomInfoData').default,Context=require('./gContext').default;
function AnalysisMsgTDak(){Base.call(this);}
AnalysisMsgTDak.prototype=Object.create(Base.prototype);
AnalysisMsgTDak.prototype.constructor=AnalysisMsgTDak;
AnalysisMsgTDak.prototype.parse=function(head,data){
  if(head==='roominfo'&&Number(data.roomid)!==Number(Room.roomId))Room.tdakSnapshot=null;
  Base.prototype.parse.call(this,head,data);
  if(head==='game_info'||head==='game_begin'||head==='game_end'){
    Room.tdakSnapshot=data;Room.tdakSnapshotRoomId=Room.roomId;
    if(head==='game_begin')this.cleanReady();
  }
  Context.eventUtils.emit('tdak_network_state',{head:head,data:data});
};
AnalysisMsgTDak.prototype.parseGame=function(data){this.parse('game_info',data);};
exports.default=AnalysisMsgTDak;
