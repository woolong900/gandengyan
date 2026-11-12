'use strict';
const digit=(n,p)=>Math.floor(n/10**p)%10;
const types=[23,24,25];
function parse(gameType,param1,param2) {
  const d=p=>digit(param2,p), f=p=>digit(param1,p);
  if(gameType===24){
    const flags=param2, ids=[param1%10-2,4,4+f(1),11+f(2)];
    for(let i=0;i<6;i++)if(flags & (1<<i))ids.push(20+i);
    return {gameType,人数:f(0),房费:['房主','AA','群主','大赢家'][f(2)],底分:flags&8?5:1,
      托管:30,踢人:0,观战:false,ids,tdak:{players:f(0),pokerMode:f(1),withJokers:!!(flags&1),
        dragonTigerLeopard:!!(flags&2),twoScoresFourteen:!!(flags&4),baseScoreFive:!!(flags&8),
        allInMultiple:flags&16?30:0,festerDouble:!!(flags&32)}};
  }
  const ddz=gameType===23, ids=[4,18,10+d(0),31+d(1),[40,42,43,44,45][d(ddz?10:7)]];
  for(const [id,on] of [[16,ddz&&f(1)],[21,ddz&&f(2)],[22,ddz&&f(3)],
    [20,d(ddz?8:5)],[200,d(ddz?9:6)]])if(on)ids.push(id);
  if(!ddz)ids.push(22+f(2),24+f(4),f(6)===2?54:53);
  return {gameType,人数:ddz?3:4,底分:(ddz?[1,2,3,5,10,20,1.5,2.5]:[1,2,3,4,5])[f(0)-1],
    房费:['房主','AA','群主'][d(0)],观战:!!d(ddz?8:5),
    托管:[0,30,60,120,180][d(ddz?10:7)]||0,踢人:[0,30,60,120][d(1)]||0,ids};
}
function validateRoomConfig({gameType,num,param1,param2}) {
  gameType=Number(gameType);num=Number(num);param1=Number(param1);param2=Number(param2);
  if(!types.includes(gameType))return '暂不支持该玩法';
  if(![num,param1,param2].every(n=>Number.isSafeInteger(n)&&n>=0))return '玩法参数无效';
  if(num<1||num>(gameType===24?1:3))return '局数参数无效';
  const c=parse(gameType,param1,param2);
  if(gameType===24){
    if(param1>=1000||param2>63||c.人数<3||c.人数>5||!c.房费||c.tdak.pokerMode<1||c.tdak.pokerMode>3)return '填大坑玩法参数无效';
    const deck=[0,20,24,52][c.tdak.pokerMode]+(c.tdak.withJokers?2:0);
    if(c.人数*5>deck)return '当前牌池不足，请减少人数或选择全坑';
  }else{
    const ddz=gameType===23;
    if(param1>=(ddz?10000:10000000)||param2>=(ddz?1e11:1e8))return '玩法参数超出范围';
    if(digit(param2,1)>3||digit(param2,2)>1||digit(param2,ddz?10:7)>4)return '托管或防作弊参数无效';
    if(digit(param2,ddz?8:5)>1||digit(param2,ddz?9:6)>1)return '功能参数无效';
    if(ddz&&[1,2,3].some(p=>digit(param1,p)>1))return '斗地主玩法参数无效';
    if(!c.底分||!c.房费)return '底分或支付参数无效';
    if(digit(param2,0)>2)return '支付参数无效';
    if(gameType===23&&digit(param2,3)!==0)return '仅支持无赖子斗地主';
    if(gameType===25&&digit(param1,1)!==0)return '仅支持四人经典掼蛋';
    if(digit(param2,gameType===23?6:3))return '暂不支持实时语音房';
    if(gameType===25&&(digit(param1,2)>1||digit(param1,4)>3||digit(param1,6)>2))return '掼蛋玩法参数无效';
  }
  return null;
}
function forGame(type){return {RATIO:Number(type)===24?1:10,parseConfig:(a,b)=>parse(Number(type),a,b),validateRoomConfig,
  roomCardCost:({num,人数,房费})=>房费==='AA'?{each:num,host:0}:{each:0,host:num*人数}};}
module.exports={types,parse,forGame,validateRoomConfig};
