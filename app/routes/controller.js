// @flow
var express = require('express');
var state = require('./../state/state');
var tops = require('./../consts/scenes');
var _ = require('lodash');


var proddev = function(prod: string) {
  var router = express.Router();
  /* GET home page. */
  return router.get('/', function(req, res, next) {
    state.get().then(function(st) {
      if (st.sc == null) {
        console.log('loading main page');
        res.render('loading');
      } else {
        console.log('rendering controller page ' + st.top);
        res.render(prod == 'prod' ? 'controllerprod' : prod == 'dev' ? 'controllerdev' : 'simplecontroller', {
          now: st.top,
          nowText: tops[st.top],
          states: require('./../state/states'),
          nav: require('./../nav/nav')(st.top),
          sacre: _.sample(["baptême !", "câlisse !", "calvaire !", "ciboire !", "crisse !", "maudit !", "osti !", "simonaque !", "tabarnak !", "viarge !"])
        });
      }
    });
  });
}
module.exports =  proddev
