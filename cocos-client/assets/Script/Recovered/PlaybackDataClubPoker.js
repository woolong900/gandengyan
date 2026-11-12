"use strict";
var Room=require('./RoomInfoData').default,Context=require('./gContext').default;
var clone=function(value){return JSON.parse(JSON.stringify(value));};
var allowed=['game_info','game_begin','game_biddealer','game_bottomcard','game_redouble',
  'game_step','game_pass','game_supplycard','game_exchangecard','game_combatsupply','game_successor','game_end'];
var replay={
  setData:function(data,code){
    this.raw=clone(data);this.code=code;
    this.raw.players.forEach(function(p){p.uid=Number(p.uid);p.score=Number(p.score);p.pos=Number(p.pos);});
    ['type','roomId','house','maxStep','param1','param2','scoreRatio'].forEach(function(k){this.raw.roomInfo[k]=Number(this.raw.roomInfo[k]||0);},this);
    this.tape=JSON.parse(data.gameInfo.extend);
    this.type=Number(data.roomInfo.type);
    this.native=this.type===23?require('./PlaybackDataDDZ').default:this.type===25?require('./PlaybackDataGD').default:null;
    if(this.native)this.native.setData(clone(this.raw),code);
  },
  init:function(club,record){
    this.club=club;this.record=record;
    if(this.native){this.native.init(club,record);return;}
    Room.reset();this._initTDak();Room.belongClub=club;
    Context.uiHelper.loadScene('SceneTDak');
  },
  _initTDak:function(){
    var info=this.raw.roomInfo;
    var config=Context.gameLogic(24).roomParam2Config(info.maxStep,info.param2,info.param1);
    Room.setPaybackData({roomId:Number(info.roomId),owner:Number(info.house),scoreRatio:info.scoreRatio||1,
      config:config,players:clone(this.raw.players)});
    Room.tdakSnapshot=clone(this.tape.initial);Room.tdakSnapshotRoomId=Room.roomId;
  },
  begin:function(){
    if(this.native)this.native.begin();else this._initTDak();
    this._parse('game_info',this.tape.initial);
  },
  step:function(index){
    var frame=this.tape.frames[index]||[];
    for(var i=0;i<frame.length;i++)if(allowed.indexOf(frame[i].head)>=0)this._parse(frame[i].head,frame[i].data);
  },
  _parse:function(head,data){
    // A redeal during playback resets the model without racing the playback
    // clock against a live deal animation. Ordinary step/voice effects remain.
    if(head==='game_begin')head='game_info';
    require('./AnalysisMsg').default.getInstance(Room.config.category()).parse(head,clone(data));
  },
  count:function(){return this.tape.frames.length;},
  playbackCode:function(){return this.code;},
  playbackRoom:function(){return this.record;}
};
exports.default=replay;
