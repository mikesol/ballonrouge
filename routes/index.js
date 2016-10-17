// @flow weak
var express = require('express');
var supercollider = require('./../supercollider/supercollider');
var PubSub = require('pubsub-js');
var states = require('./../state/states');
var state = require('./../state/state');

const title = 'Le ballon rouge';
var tops = require('./../consts/scenes');

var render = function(res, template, state) {
  res.render(template, {
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

var masterslave = function(master) {
  var router = express.Router();
  /* GET home page. */
  return router.get('/', function(req, res, next) {
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
          console.log("setting sc");
          state.set({
            sc: sc
          });
          console.log("sc set");
        });
      } else {
        console.log('rendering main page');
        render(res, master ? 'index' : 'indexslave', st);
      }
    });
  });
}

module.exports = masterslave
