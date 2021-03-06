// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var city1 = require('./city1');
var common = require('./common');
var aiftools = require('./../aiftools/aiftools');
var event = new EventEmitter();
var scene = new EvSeq(event);

// can also use carrefourPlayer
scene.at('0.0s', ril, ["/n_set", city1.cityGateId, "gate", 0], 'cityGateEnd');


module.exports = {
  scene: scene,
  event: event
}
