// @flow
var states = require('./../state/states')
var scenes  = require('./../consts/scenes')

module.exports = function(top: number) {
  return [{
    i: 0,
    fa: 'backward',
    text: 'revenir en arrière',
    top: Math.max(top - 1, 0),
    verb: states.STAGED
  }, {
    i: 1,
    fa: 'forward',
    text: 'avancer',
    top: Math.min(top + 1, scenes.length - 1),
    verb: states.STAGED
  }, {
    i: 2,
    fa: 'repeat',
    text: '(re)commencer',
    top: top,
    verb: states.STAGED
  }, {
    i: 3,
    fa: 'stop',
    text: 'stop',
    top: top,
    verb: states.STOPPED
  }, {
    i: 4,
    fa: 'pause',
    text: 'mise en veille',
    top: top,
    verb: states.PAUSED
  }]
}
