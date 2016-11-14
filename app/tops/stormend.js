// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')
var storm = require('./storm')

var event = new EventEmitter();
var scene = new EvSeq(event);


scene.at('0.0s', ril, ["/n_set", storm.stormGateId, "gate", 0]);

module.exports = {
  scene: scene,
  event: event
}
