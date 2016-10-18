// @flow weak

var redis = require('redis');
var bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

module.exports = {
  get : client.getAsync,
  set : client.setAsync
}
