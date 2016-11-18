// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var cross = require('./cross');

var event = new EventEmitter();
var scene = new EvSeq(event);
for (var i = 0; i < cross.nodes.length; i++) {
  scene.at('0.0s', ril, ["/n_set", cross.nodes[i], "gate", 0], 'crossNodesEnd');
}
module.exports = {
  scene: scene,
  event: event
}
