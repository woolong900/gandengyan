"use strict";
// Network messages can arrive while native cards are still moving/flipping.
// Hold visual state changes until that animation's completion callback. A full
// reconnect snapshot supersedes the queue; never replay stale turns afterwards.
exports.route=function(parser,head,data){
  if(head==='game_info'||head==='game_begin'||head==='exitroom'||head==='game_bye')parser._dealQueue=null;
  else if(parser._dealQueue && /^game_(operator|biddealer|bottomcard|redouble|step|pass|supplycard|exchangecard|combatsupply|successor|end)$/.test(head)){
    parser._dealQueue.push([head,data]);return true;
  }
  return false;
};
exports.begin=function(parser){
  var queue=[];parser._dealQueue=queue;
  return function(){
    if(parser._dealQueue!==queue)return;
    parser._dealQueue=null;
    for(var i=0;i<queue.length;i++)parser.parse(queue[i][0],queue[i][1]);
  };
};
