// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var randomstring = require("randomstring");

console.log(s);

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

var buffers = _.assign({}, popbufs, airbufs)
var bufdurs = aiftools.bufdurs(_.keys(buffers));
var group = 0;

// outbus only applies to air because we want the pops to be unaltered
// kinda kludgy...fix
var airpop = function(ntimes: number, randlow: number, randhi: number, starttime: number,
  outbus: number, scene: EvSeq) {
  var prevair = null;
  var prevpop = null;
  for (var i = 0; i < ntimes; i++) {
    var randy = randomstring.generate();
    starttime += _.random(randlow, randhi, true);
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
    scene.at(starttime + 's', ril, ["/s_new", "envRamp", s.nextNodeID(), 0, group, "out", outbus, "bufnum", airbufs[air], "inflection", 0.2, "mul", 1.5], randy);
    var wait = starttime + bufdurs[air]
    for (var j = 0; j < _.random(8, 12); j++) {
      scene.at(wait + 's', ril, ["/s_new", "simplePitchShift", s.nextNodeID(), 1, group, "out", 0, "bufnum", popbufs[pop], "shift", 1.2 - (j * 0.03), "mul", 1.0 / Math.log(j + 3)], randy);
      wait += ((Math.log(i + 2)) * 0.3);
    }
  }
}

module.exports = {
  group: group,
  buffers: buffers,
  synthdefs: [
    'SynthDef.new("simplePitchShift",{|out, bufnum, shift, mul = 1.0| Out.ar(out, PitchShift.ar(PlayBuf.ar(2, bufnum, 1, doneAction: 2), 0.2, shift) * mul);})',
    'SynthDef.new("verbBus",{|in, out| Out.ar(out,FreeVerb2.ar(In.ar(in, 1), In.ar(in+1, 1)),0.9,0.9,0.1);})',
    'SynthDef.new("envRamp",{|out, bufnum, inflection, panStart=1.0, panEnd=1.0, mul=1.0| var bd = BufDur.kr(bufnum); Out.ar(out, Pan2.ar(HPF.ar( PlayBuf.ar(2, bufnum, 1, doneAction: 2), Line.kr(1,1,bd)) * EnvGen.kr(Env.new([0.5,0.1,0.2,1,0],[0.2*bd,0.5*bd,0.2*bd,0.1*bd]),) * mul, Line.kr(panStart, panEnd, bd)));})',
    'SynthDef.new("vanillaPlayer",{|out, bufnum, mul = 1.0|Out.ar(out, PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
  ],
  airpop: airpop
}
