// @flow
var express = require('express');
var states = require('./../state/states');
var state = require('./../state/state');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  state.get().then(function(st) {
    if (st.sc == null) {
      console.log('loading main page');
      res.render('loading');
    } else {
      console.log('rendering controller page '+st.top);
      res.render('controller', {now:st.top,nowText:'foo'});
    }
  });
});
module.exports = router
