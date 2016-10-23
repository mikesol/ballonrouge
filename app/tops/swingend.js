// @flow

var Sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = Sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var swing = require('./swing');
var common = require('./common');
var event = new EventEmitter();
var scene = new Sequitur(event);
var swingend = {
  'swingend': s.nextBuffer(),
}

var buffers = _.assign({}, swing);

scene.at('0.0s', ril, ["/n_set", swing.swingId, 'gate', 0]);
scene.at('0.0s', ril, ["/s_new", "swingPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", swingend.swingend]);


module.exports = {
  scene: scene,
  event: event,
  buffers: swingend
}
