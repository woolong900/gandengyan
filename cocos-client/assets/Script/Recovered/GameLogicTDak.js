"use strict";
var Base=require('./GameLogicBase').default;
function GameLogicTDak(){Base.call(this);}
GameLogicTDak.prototype=Object.create(Base.prototype);
GameLogicTDak.prototype.constructor=GameLogicTDak;
GameLogicTDak.getInstance=function(){return this._instance||(this._instance=new GameLogicTDak());};
GameLogicTDak.prototype.roomConfig2Param=function(c,clubId){
  var mode=c.isChecked(5)?1:c.isChecked(6)?2:3,pay=c.isChecked(12)?1:c.isChecked(13)?2:c.isChecked(14)?3:0,flags=0;
  for(var i=0;i<6;i++)if(c.isChecked(20+i))flags|=1<<i;
  return {gameType:24,num:1,param1:c.peopleCount()+mode*10+pay*100,param2:flags,clubId:clubId};
};
GameLogicTDak.prototype.roomParam2Config=function(count,flags,param){
  var ids=[param%10-2,4,4+Math.floor(param/10)%10,11+Math.floor(param/100)%10];
  for(var i=0;i<6;i++)if(flags&(1<<i))ids.push(20+i);
  return {index:24,ids:ids,ipLimit:0,other:{}};
};
GameLogicTDak.prototype.isRealTime=function(){return false;};
GameLogicTDak.prototype.isAutoGameRoom=function(){return true;};
GameLogicTDak.prototype.autoGameCountDown=function(){return 30;};
GameLogicTDak.prototype.roomDetails=function(c){return c.listDescDetails([1,2,3,4,5,6,7,11,12,13,14,20,21,22,23,24,25],'、');};
GameLogicTDak.prototype.allRuleDesc=function(c,sep){return c.gameName()+(sep||' ')+this.roomDetails(c);};
GameLogicTDak.prototype.scoreRuleDesc=function(c){return '底分：'+(c.isChecked(23)?5:1);};
exports.default=GameLogicTDak;
