// @flow

var Sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = Sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var carrefour = require('./carrefour');
var common = require('./common');
var aiftools = require('./../aiftools/aiftools');
var event = new EventEmitter();
var scene = new Sequitur(event);
var carrefourend = {
  'carrefourend': s.nextBuffer(),
}
var bufdurs = aiftools.bufdurs(_.keys(carrefourend));
// can also use carrefourPlayer
scene.at('0.0s', ril, ["/s_new", "carrefourPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", carrefourend.carrefourend], 'carrefourend');
scene.at(bufdurs['carrefourend']+'s', ril, ["/n_free", carrefour.carrefourId], 'carrefourend');


module.exports = {
  scene: scene,
  event: event,
  buffers: carrefourend
}
