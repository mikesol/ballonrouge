// @flow
var express = require('express');
var PubSub = require('pubsub-js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('controller',{now:0,next:1});
  PubSub.publish( 'MY TOPIC', 'hello world!' );
});

module.exports = router
