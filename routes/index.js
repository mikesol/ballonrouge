// @flow
var express = require('express');
var supercollider = require('./../supercollider/supercollider');
var PubSub = require('pubsub-js');
var router = express.Router();
var states = require('./../state/states');
var state = require('./../state/state');

const title = 'Le ballon rouge';
var tops = require('./../consts/scenes');

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
    nav: require('./../nav/nav.js')(state)
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
