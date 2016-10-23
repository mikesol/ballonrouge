// @flow

var Sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = Sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var carrefour = {
  'carrefour': s.nextBuffer(),
}
var carrefourId = s.nextNodeID()
var event = new EventEmitter();
var scene = new Sequitur(event);
scene.at('0.0s', ril, ["/s_new", "carrefourPlayer", carrefourId, 0, common.group, "out", 0, "bufnum", carrefour.carrefour]);

module.exports = {
  carrefourId: carrefourId,
  buffers: carrefour,
  scene: scene,
  event: event,
  // for now same as swing player
  synthdefs: [ //'SynthDef.new("tutorial-SinOsc0", { Out.ar(0, SinOsc.ar(440, 0, 0.2))}).asBytes',
  'SynthDef.new("carrefourPlayer",{|out, bufnum, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,6,-1),gate,doneAction:2) * PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
  //'SynthDef.new("simplePitchShiftHPF",{|out, bufnum, shift, mul = 1.0| Out.ar(out, HPF.ar(PitchShift.ar(PlayBuf.ar(2, bufnum, 1, doneAction: 2), 0.2, shift), 4000) * mul);})',
]
}
