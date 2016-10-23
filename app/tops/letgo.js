// @flow

var Sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = Sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var letgo = {
  'letgo': s.nextBuffer(),
}
var letgoId = s.nextNodeID()
var event = new EventEmitter();
var scene = new Sequitur(event);

scene.at('0.0s', ril, ["/s_new", "letgoPlayer", letgoId, 0, common.group, "out", 0, "bufnum", letgo.letgo]);

module.exports = {
  letgoId: letgoId,
  buffers: letgo,
  scene: scene,
  event: event,
  // for now same as swing player
  synthdefs: [
  'SynthDef.new("letgoPlayer",{|out, bufnum, mul = 1.0|Out.ar(out, PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
]
}
