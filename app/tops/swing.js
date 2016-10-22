// @flow

var sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var entry = require('./entry');
var swing = {
  'swing': s.nextBuffer(),
}
var swingId = s.nextNodeID()
var event = new EventEmitter();
var scene = sequitur(event);
scene.at('0.0s', ril, ["/s_new", "swingPlayer", swingId, 0, entry.group, "out", 0, "bufnum", swing.swing]);

module.exports = {
  swingId: swingId,
  buffers: swing,
  scene: scene,
  event: event,
  synthdefs: [ //'SynthDef.new("tutorial-SinOsc0", { Out.ar(0, SinOsc.ar(440, 0, 0.2))}).asBytes',
  'SynthDef.new("swingPlayer",{|out, bufnum, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,6,-1),gate,doneAction:2) * PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
  //'SynthDef.new("simplePitchShiftHPF",{|out, bufnum, shift, mul = 1.0| Out.ar(out, HPF.ar(PitchShift.ar(PlayBuf.ar(2, bufnum, 1, doneAction: 2), 0.2, shift), 4000) * mul);})',
]
}
