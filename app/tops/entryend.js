// @flow

var Sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = Sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var entry = require('./entry');

var event = new EventEmitter();
var scene = new Sequitur(event);
entry.klankIds.forEach((x)=>scene.at('0.0s', ril, ["/n_set", x, 'gate', 0], 'entryend'));
scene.at('11.0s', ril, ["/n_free", entry.verbId], 'entryend');

module.exports = {
  scene: scene,
  event: event
}
