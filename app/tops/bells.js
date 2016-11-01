// @flow

var vanilla = require('./vanilla');
var bells = vanilla('bells');
var common = require('./common');

common.airpop(200, 10, 20, 0, 4, bells.scene);

module.exports = bells;
