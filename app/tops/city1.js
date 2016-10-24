// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')

console.log(s);

var cityGateId = s.nextNodeID()

var buffers = {
  'earlyMorningCity': s.nextBuffer(),
  '331540__jmpeeples__2000-nissan-maxima-car-horn': s.nextBuffer(),
  '330956__nikiforov5000__bicycle-bell': s.nextBuffer()
}

var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);
scene.at('0.0s', ril, ["/s_new", "city1Gate", cityGateId, 0, common.group, "in", 4, "out", 0]);
scene.at('0.0s', ril, ["/s_new", "city1Player", s.nextNodeID(), 0, common.group, "out", 4, "bufnum", buffers.earlyMorningCity]);
scene.at('0.0s', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group, "out", 4, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 1.0, "pan", 0, "depth", 0.5, "mul", 0.4]);
scene.at('6.5s', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group, "out", 4, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 1.42, "pan", -1, "depth", 0.5, "mul", 0.2]);
scene.at('8.7s', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group, "out", 4, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 0.7, "pan", 1, "depth", 0.5, "mul", 0.2]);
for (var i = 0; i < 10; i++) {
  scene.at((14.6 + (i * 0.1)) + 's', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group,
    "out", 4, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 1 + (i * 0.05), "pan", -0.95 + (i * 0.1),
    "depth", 1.0 - (i * 0.1), "mul", 0.1
  ]);
}
var P1 = 0.69;
var P2 = 0.776;
var P3 = 0.886;
var score = [
    [0, P1],
    [4.1, P3],
    [9, P1],
    [11, P2],
    [12.6, P3],
    [15, P2],
    [18, P1],
    [19.5, P3],
    [21, P2],
    [23.2, P2],
    [27, P1]
  ].map((i) => ({
    offset: i[0],
    pitch: i[1],
    pan: _.random(-1, 1, true),
    depth: _.random(0.1, 0.6, true)
  }));
  
for (var i = 0; i < score.length; i++) {
  scene.at((41 + score[i].offset) + 's', ril, ["/s_new", "city1CarHorn", s.nextNodeID(), 0, common.group, "out", 4, "bufnum", buffers['331540__jmpeeples__2000-nissan-maxima-car-horn'], "pitch", score[i].pitch, "pan", score[i].pan, "depth", score[i].depth]);
}

common.airpop(200, 10, 20, 0, 4, scene);

module.exports = {
  cityGateId: cityGateId,
  buffers: buffers,
  scene: scene,
  event: event,
  synthdefs: [
    'SynthDef.new("city1Gate",{|out, in, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,6,-1),gate,doneAction:2) * In.ar(in,2) * mul);})',
    `SynthDef.new("city1Player",{arg out, bufnum;
	var buffy, mouseX, mouseY, hpf, celing;
	mouseY = EnvGen.kr(Env.new([0.001,0.6,0.4,0.8,0.5,0.8,0.9,0.5,0.9,0.6,1.0,1.0],[2,2,2,2,2,2,2,6,3,6,100]));
	buffy = PlayBuf.ar(1,bufnum,BufRateScale.kr(bufnum)*mouseY, doneAction: 2);
	celing = 10000;
	hpf = HPF.ar(buffy, celing * (1 - mouseY));
	Out.ar(out,Pan2.ar(hpf * (0.5 + (mouseY * 0.5))*SinOsc.kr(0.2,0,0.2,0.9), EnvGen.kr(Env.new([-1,1,-0.5,0.5,0,0],[4,4,4,4,100]))));
})`,
    `SynthDef.new("city1CarHorn",{arg out, bufnum, pitch, pan, depth;
	var buffy, celing;
	var dur=1.0/pitch;
	var env = Env.new([1,1],[dur],'linear');
	var envgen = EnvGen.kr(env, doneAction:2);
	buffy = PlayBuf.ar(1,bufnum,BufRateScale.kr(bufnum)*pitch, startPos: 44100*10);
	celing = 10000;
	buffy = HPF.ar(buffy, celing * (1 - depth));
	Out.ar(out,Pan2.ar(buffy*envgen, pan));
})`,
    `SynthDef.new("city1Bike",{arg out, bufnum, pitch, pan, depth,mul=1.0;
	var buffy, celing;
	var dur=1.0/pitch;
	buffy = PlayBuf.ar(1,bufnum,BufRateScale.kr(bufnum)*Line.kr(pitch,1,BufDur.kr(bufnum)), doneAction: 2);
	celing = 10000;
	buffy = HPF.ar(buffy, celing * (1 - depth));
	Out.ar(out,Pan2.ar(buffy, pan)*mul);
})`,
  ]
}
