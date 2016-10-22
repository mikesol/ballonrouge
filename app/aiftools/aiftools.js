// @flow

var _ = require('lodash');
var info = require('./../../sounds/soundinfo.json')

module.exports = {
  bufdurs: (i: any) => _.pick(info, i)
}
