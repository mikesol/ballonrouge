// @flow

var Sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = Sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var grab = {
  'grab': s.nextBuffer(),
}
var grabId = s.nextNodeID()
var event = new EventEmitter();
var scene = new Sequitur(event);

scene.at('0.0s', ril, ["/s_new", "grabPlayer", grabId, 0, common.group, "out", 0, "bufnum", grab.grab]);

module.exports = {
  grabId: grabId,
  buffers: grab,
  scene: scene,
  event: event,
  // for now same as swing player
  synthdefs: [
  'SynthDef.new("grabPlayer",{|out, bufnum, mul = 1.0|Out.ar(out, PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
]
}
