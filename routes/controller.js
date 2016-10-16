// @flow
var express = require('express');
var state = require('./../state/state');
var router = express.Router();
var tops = require('./../consts/scenes');

/* GET home page. */
router.get('/', function(req, res, next) {
  state.get().then(function(st) {
    if (st.sc == null) {
      res.render('loading');
    } else {
      res.render('controllerprod', {
        now: st.top,
        nowText: tops[st.top],
        states: require('./../state/states')
      });
    }
  });
});
module.exports = router
