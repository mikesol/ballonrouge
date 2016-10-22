// @flow

var sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var entry = require('./entry');
var grab = {
  'grab': s.nextBuffer(),
}
var grabId = s.nextNodeID()
var event = new EventEmitter();
var scene = sequitur(event);

scene.at('0.0s', ril, ["/s_new", "grabPlayer", grabId, 0, entry.group, "out", 0, "bufnum", grab.grab]);

module.exports = {
  grabId: grabId,
  buffers: grab,
  scene: scene,
  event: event,
  // for now same as swing player
  synthdefs: [ //'SynthDef.new("tutorial-SinOsc0", { Out.ar(0, SinOsc.ar(440, 0, 0.2))}).asBytes',
  'SynthDef.new("grabPlayer",{|out, bufnum, mul = 1.0|Out.ar(out, PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
  //'SynthDef.new("simplePitchShiftHPF",{|out, bufnum, shift, mul = 1.0| Out.ar(out, HPF.ar(PitchShift.ar(PlayBuf.ar(2, bufnum, 1, doneAction: 2), 0.2, shift), 4000) * mul);})',
]
}
