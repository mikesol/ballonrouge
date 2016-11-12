// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var chain = {}
chain['letgo'] = s.nextBuffer();
chain['windows'] = s.nextBuffer();
chain['ride'] = s.nextBuffer();
chain['thierry3'] = s.nextBuffer();
chain['saw'] = s.nextBuffer();

var event = new EventEmitter();
var scene = new EvSeq(event);

scene.at('0.0s', ril, ["/s_new", "vanillaPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", chain['letgo']]);
for (var j = 0; j < 2; j++) {
  scene.at(((j * 40) + 10.0) + 's', ril, ["/s_new", "vanillaPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", chain['windows']]);
  scene.at(((j * 40) + 19.0) + 's', ril, ["/s_new", "vanillaPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", chain['ride']]);
  scene.at(((j * 40) + 32.0) + 's', ril, ["/s_new", "vanillaPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", chain['thierry3']]);
  scene.at(((j * 40) + 40.0) + 's', ril, ["/s_new", "vanillaPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", chain['saw']]);
}
module.exports = {
  buffers: chain,
  scene: scene,
  event: event
}
