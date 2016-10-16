// @flow
var express = require('express');
var supercollider = require('./../supercollider/supercollider');
var PubSub = require('pubsub-js');
var router = express.Router();
var states = require('./../state/states');
var state = require('./../state/state');

const title = 'Le ballon rouge';
const tops = [
  'Entrée public',
  'Balançoire',
  'Carrefour',
  'Prise en main du ballon',
  'Première ville',
  'Le garçon relâche le ballon',
  'Fenêtres',
  'Assis sur le ballon',
  'Il perd son ballon',
  'Traversée magique du ballon',
  'Deuxième ville',
  'Il fout le bordel dans l\'immeuble',
  'Fin du bordel',
  'Son ami la lampe le sauve',
  'La lampe se transforme en pont',
];

var render = function(res, state) {
  res.render('index', {
    title: title,
    now: state.top,
    next: state.top >= tops.length - 1 ? 'fin' : state.top + 1,
    nowText: tops[state.top],
    nextText: state.top >= tops.length - 1 ? '(bravo !)' : tops[state.top + 1],
    states: states,
    range: Array(tops.length)
      .fill(null)
      .reduce((pre, cur) => pre.concat([pre.length]), []),
    topmatter: [{
      i: 0,
      text: 'revenir en arrière',
      top: Math.max(state.top - 1, 0),
      verb: states.STAGED
    }, {
      i: 1,
      text: 'avancer',
      top: Math.min(state.top + 1, tops.length - 1),
      verb: states.STAGED
    }, {
      i: 2,
      text: '(re)commencer',
      top: state.top,
      verb: states.STAGED
    }, {
      i: 3,
      text: 'stop',
      top: state.top,
      verb: states.STOPPED
    }, {
      i: 4,
      text: 'mise en veille',
      top: state.top,
      verb: states.PAUSED
    }]
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  state.get().then(function(st) {
    if (st.sc == null) {
      console.log('loading main page');
      res.render('loading');
      supercollider.init().then(function(sc) {
        process.once('SIGUSR2', function() {
          sc.sclang.quit();
          sc.server.quit();
          process.kill(process.pid, 'SIGUSR2');
        });
        state.set({
          verb: states.STOPPED,
          top: 0,
          sc: sc
        });
      });
    } else {
      console.log('rendering main page');
      render(res, st);
    }
  });
});

module.exports = router
