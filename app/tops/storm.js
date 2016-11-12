// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')
var mpqq_2 = require('./mpqq_2')

console.log(s);

var buffers = {
  'fill1': s.nextBuffer(),
  'fill2': s.nextBuffer(),
  'fill3': s.nextBuffer(),
  'fill4': s.nextBuffer(),
  'fill5': s.nextBuffer(),
  'fill6': s.nextBuffer()
}

var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);

var t = 0.05;

let nTimes = 100;

var increase = function(now: number, final: number) {
  let accel = 2;
  var maxGap = 5;
  var maxRand = 3.0;
  var minGap = 0.2;
  var minRand = 0.6;
  var gap = 0;
  var rand = 0;
  if (now >= final) {
    gap = minGap;
    rand = Math.random() * minRand;
  } else {
    gap = (Math.pow((now * 1.0 / final),accel)*(maxGap - minGap)) + minGap;
    rand = ((Math.pow((now * 1.0 / final),accel)*(maxRand - minRand)) + minRand) * Math.random();
  }
  return gap + rand;
}


scene.at('0.0s', ril, ["/n_set", mpqq_2.mpqq_2Id, "gate", 0.0]);

var stormGateId = s.nextNodeID();
scene.at('0.0s', ril, ["/s_new", "city1Gate", stormGateId, 0, common.group, "in", 6, "out", 0]);

for (var j = 0; j < nTimes; j++) {
  var gap = 0.05 + (Math.random() * 0.2);
  var pan = (2 * Math.random()) - 1;
  var fillVal = _.sample(_.keys(buffers))
  var base = 0.5 + (Math.random() * 0.9);
  for (var i = 0; i < 7+(Math.random()*20); i++) {
    scene.at(t + 's', ril, ["/s_new", "funWithFill", s.nextNodeID(), 0, common.group,
      "out", 6, "bufnum", buffers[fillVal],"speed",base+(i*0.05),"pan",pan,"vol",0.2+(Math.random()*0.4),"hpfreq",500+(Math.random()*1000)
    ]);
    t += gap;
  }
  t += increase(j, nTimes);
}

// airpop goes to 4, which is where our entry bus is
common.airpop(200, 10, 20, 0, 4, scene);

module.exports = {
  stormGateId: stormGateId,
  buffers: buffers,
  scene: scene,
  event: event,
  synthdefs: [
'SynthDef.new("funWithFill",{|out,bufnum,speed,pan,vol,hpfreq|Out.ar(out,EnvGen.kr(Env.new([vol,vol],[BufDur.kr(bufnum)*5]),doneAction:2)*Pan2.ar(HPF.ar(FreeVerb.ar(PlayBuf.ar(1,bufnum,speed*BufRateScale.kr(bufnum)),0.5,0.25,0.5),hpfreq),pan))})'
  ]
}
