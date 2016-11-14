// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var swing = require('./swing');
var common = require('./common');
var event = new EventEmitter();
var scene = new EvSeq(event);
var swingend = {
  'swingend': s.nextBuffer(),
}

var buffers = _.assign({}, swing);

scene.at('0.0s', ril, ["/n_set", swing.swingId, 'gate', 0]);
scene.at('0.0s', ril, ["/s_new", "swingPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", swingend.swingend]);
common.airpop(5, 15, 25, 30, 4, scene);

module.exports = {
  scene: scene,
  event: event,
  buffers: swingend
}
