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

var chainId = s.nextNodeID()
var event = new EventEmitter();
var scene = new EvSeq(event);

scene.at('0.0s', ril, ["/s_new", "chainPlayer", chainId, 0, common.group, "out", 0, "bufnum", chain['letgo']]);
scene.at('10.0s', ril, ["/s_new", "chainPlayer", chainId, 0, common.group, "out", 0, "bufnum", chain['windows']]);
scene.at('17.0s', ril, ["/s_new", "chainPlayer", chainId, 0, common.group, "out", 0, "bufnum", chain['ride']]);

module.exports = {
    buffers: chain,
    scene: scene,
    event: event
}
