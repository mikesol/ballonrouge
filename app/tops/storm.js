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

var t = 10.05;

scene.at('0.0s', ril, ["/n_set", mpqq_2.mpqq_2Id, "gate", 0.0]);

var stormGateId = s.nextNodeID();
scene.at('0.0s', ril, ["/s_new", "city1Gate", stormGateId, 0, common.group, "in", 4, "out", 0]);

var nTimes = 4;

for (var k = 0; k < 30; k++) {
  nTimes += 1;
  for (var j = 0; j < nTimes; j++) {
    var gap = 0.05 + (Math.random() * 0.2);
    var pan = (2 * Math.random()) - 1;
    var fillVal = _.sample(_.keys(buffers))
    var base = 0.5 + (Math.random() * 0.9);
    for (var i = 0; i < 7 + (Math.random() * 20); i++) {
      scene.at(t + 's', ril, ["/s_new", "funWithFill", s.nextNodeID(), 0, common.group,
        "out", 4, "bufnum", buffers[fillVal], "speed", base + (i * 0.05), "pan", pan, "vol", 0.2 + (Math.random() * 0.4), "hpfreq", 500 + (Math.random() * 1000)
      ]);
      t += gap;
    }
    t += (Math.random() * 0.5) + 0.5;
  }
  t += (k % 4 == 0 ? 10 : 3);
}

let tempo = 0.2;
var sinTime = 0;
var strainSize = 16;
var ctr = 0;
var pitches = [220.0, 247.5, 278.4375, 330.0, 371.25, 440, 495, 556.875, 660, 742.5, 880, 990, 1113.75, 1320, 1485.0, 1320, 1485, 1670.625, 1980, 2227.5];
for (var i = 0; i < 15; i++) {
  pitches = _.shuffle(pitches);
  for (var j = 0; j < 4; j++) {
    for (var k = 0; k < strainSize; k++) {
      scene.at(sinTime + 's', ril, ["/s_new", "plucker", s.nextNodeID(), 0, common.group,
        "out", 0, "freq", pitches[k%pitches.length], "coef", Math.random()*0.4 + 0.1, "vol", Math.random() * 0.5 + 0.5,"pan",Math.random() * 2 - 1
      ], "mysteryGroup"+ctr);
      sinTime += tempo;
    }
    ctr += 1;
  }
  strainSize += 4;
}
// airpop goes to 4, which is where our entry bus is
common.airpop(200, 10, 20, 0, 4, scene);

module.exports = {
  stormGateId: stormGateId,
  buffers: buffers,
  scene: scene,
  event: event,
  synthdefs: [
    'SynthDef.new("funWithFill",{|out,bufnum,speed,pan,vol,hpfreq|Out.ar(out,EnvGen.kr(Env.new([vol,vol],[BufDur.kr(bufnum)*5]),doneAction:2)*Pan2.ar(HPF.ar(FreeVerb.ar(PlayBuf.ar(1,bufnum,speed*BufRateScale.kr(bufnum)),0.5,0.25,0.5),hpfreq),pan))})',
    'SynthDef.new("plucker",{|out,freq,vol,coef,pan|Out.ar(out,Pan2.ar(vol*EnvGen.kr(Env.new([1,1],[4]),doneAction:2)*Pluck.ar(WhiteNoise.ar(0.1), Impulse.kr(0.1), freq.reciprocal, freq.reciprocal, 10, coef:coef),pan))})'
  ]
}
