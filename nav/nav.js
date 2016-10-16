var states = require('./../state/states')
var scenes  = require('./../consts/scenes')

module.exports = function(state) {
  return [{
    i: 0,
    fa: 'backward',
    text: 'revenir en arrière',
    top: Math.max(state.top - 1, 0),
    verb: states.STAGED
  }, {
    i: 1,
    fa: 'forward',
    text: 'avancer',
    top: Math.min(state.top + 1, scenes.length - 1),
    verb: states.STAGED
  }, {
    i: 2,
    fa: 'repeat',
    text: '(re)commencer',
    top: state.top,
    verb: states.STAGED
  }, {
    i: 3,
    fa: 'stop',
    text: 'stop',
    top: state.top,
    verb: states.STOPPED
  }, {
    i: 4,
    fa: 'pause',
    text: 'mise en veille',
    top: state.top,
    verb: states.PAUSED
  }]
}
