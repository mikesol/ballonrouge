// @flow weak

var _ = require('lodash');
var info = require('./../sounds/soundinfo.json')

module.exports = {
  bufdurs: (i) => _.pick(info, i)
}
