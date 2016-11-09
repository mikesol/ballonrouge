// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var cross = require('./cross');
var common = require('./common');
var event = new EventEmitter();
var scene = new EvSeq(event);

scene.at('0.0s', ril, ["/n_set", cross.crossId, 'gate', 0]);

module.exports = {
  scene: scene,
  event: event
}
