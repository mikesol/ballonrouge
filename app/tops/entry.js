// @flow

var sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');

console.log(s);

var mpqq = {
  'mpqq_15_melody': s.nextBuffer()
}
var popbufs = {
  'pop1': s.nextBuffer(),
  'pop2': s.nextBuffer(),
  'pop3': s.nextBuffer(),
  'pop4': s.nextBuffer(),
  'pop5': s.nextBuffer(),
  'pop6': s.nextBuffer(),
  'pop7': s.nextBuffer(),
  'pop8': s.nextBuffer(),
  'pop9': s.nextBuffer(),
  'pop10': s.nextBuffer()
}
var airbufs = {
  'air2': s.nextBuffer(),
  'air3': s.nextBuffer(),
  'air4': s.nextBuffer(),
  'air5': s.nextBuffer(),
  'air6': s.nextBuffer()
}

var verbId = s.nextNodeID()

var buffers = _.assign({}, popbufs, mpqq, airbufs)
var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = sequitur(event);
var group = 0;
var kludge = 0.0;
scene.at(kludge+'s', ril, ["/s_new", "verbBus", verbId, 0, group, "in", 4, "out", 0]);


var klankIds = [];
for (var i = 0; i < 6; i++) {
  klankIds.push(s.nextNodeID());
  scene.at((kludge + (i * 0.5)) + 's', ril, ["/s_new", "klankPitchShift", klankIds[i], 0, group, "out", 4, "bufnum", _.values(mpqq)[0], "shift", i === 0 ? 1.0 : 0.9, "mul", Math.pow(0.95, i * 20)]);
}

var starttime = 0;
var prevair = null;
var prevpop = null;
for (var i = 0; i < 200; i++) {
  starttime += _.random(10, 20, true);
  var air;
  do {
    air = _.sample(_.keys(airbufs));
  } while (air == prevair);
  prevair = air;
  var pop;
  do {
    pop = _.sample(_.keys(popbufs));
  } while (pop == prevpop);
  prevpop = pop;
  scene.at(starttime + 's', ril, ["/s_new", "envRamp", s.nextNodeID(), 0, group, "out", 4, "bufnum", airbufs[air], "inflection", 0.2, "mul", 1.5]);
  var wait = starttime + bufdurs[air]
  for (var j = 0; j < _.random(8, 12); j++) {
    scene.AT(wait + 's', ril, ["/s_new", "simplePitchShift", s.nextNodeID(), 1, group, "out", 0, "bufnum", popbufs[pop], "shift", 1.2 - (j * 0.03), "mul", 1.0/Math.log(j+3)]);
    wait += ((Math.log(i + 2)) * 0.3);
  }
}

module.exports = {
  group: group,
  verbId: verbId,
  klankIds: klankIds,
  buffers: buffers,
  scene: scene,
  event: event,
  synthdefs: [ //'SynthDef.new("tutorial-SinOsc0", { Out.ar(0, SinOsc.ar(440, 0, 0.2))}).asBytes',
  'SynthDef.new("klankPitchShift",{|out, bufnum, shift, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,9,-1),gate,doneAction:2)*HPF.ar(PitchShift.ar(Klank.ar(`[[200, 1040, 2481, 3605], nil, [1, 1, 1, 1]], PlayBuf.ar(2,bufnum)), 0.2, shift), 8000) * mul);})',
  //'SynthDef.new("simplePitchShiftHPF",{|out, bufnum, shift, mul = 1.0| Out.ar(out, HPF.ar(PitchShift.ar(PlayBuf.ar(2, bufnum, 1, doneAction: 2), 0.2, shift), 4000) * mul);})',
  'SynthDef.new("simplePitchShift",{|out, bufnum, shift, mul = 1.0| Out.ar(out, PitchShift.ar(PlayBuf.ar(2, bufnum, 1, doneAction: 2), 0.2, shift) * mul);})',
  'SynthDef.new("verbBus",{|in, out| Out.ar(out,FreeVerb2.ar(In.ar(in, 1), In.ar(in+1, 1)),0.9,0.9,0.1);})',
  'SynthDef.new("envRamp",{|out, bufnum, inflection, panStart=1.0, panEnd=1.0, mul=1.0| var bd = BufDur.kr(bufnum); Out.ar(out, Pan2.ar(HPF.ar( PlayBuf.ar(2, bufnum, 1, doneAction: 2), Line.kr(1,1,bd)) * EnvGen.kr(Env.new([0.5,0.1,0.2,1,0],[0.2*bd,0.5*bd,0.2*bd,0.1*bd]),) * mul, Line.kr(panStart, panEnd, bd)));})'
]
}
