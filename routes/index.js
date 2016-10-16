// @flow
var express = require('express');
var supercollider = require('./../supercollider/supercollider');
var PubSub = require('pubsub-js');
var router = express.Router();

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

const states = {
  STAGED: 0,
  PAUSED: 1,
  PLAYING: 2,
  STOPPED: 3
}

const state = {
  top: 0,
  verb: states.STOPPED
};

var render = function(res) {
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
  res.render('loading');
  supercollider.init().then(function(sc) {
    process.once('SIGUSR2', function() {
      sc.sclang.quit();
      sc.server.quit();
      process.kill(process.pid, 'SIGUSR2');
    });
    router.post('/', function(req, res) {
      var top = 0;
      if (req.body.top !== null) {
        top = parseInt(req.body.top);
      }
      var verb = states.STOPPED;
      if (req.body.state !== null) {
        verb = parseInt(req.body.state);
      }
      state.top = top;
      state.verb = verb;
      render(res);
      // create a function to subscribe to topics
      var mySubscriber = function(msg, data) {
        console.log(msg, data);
      };

      // add the function to the list of subscribers for a particular topic
      // we're keeping the returned token, in order to be able to unsubscribe
      // from the topic later on
      var token = PubSub.subscribe('MY TOPIC', mySubscriber);
    });
    res.io.emit('loaded', true);
  });
});

module.exports = router
