// @flow

var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

var get = function(key: string) {
  return new Promise(function(resolve, reject) {
    client.get(key, function(err, res) {
      if (err != null) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

var set = function(key: string, val: number | string) {
  return new Promise(function(resolve, reject) {
    client.set(key, val, function(err, res) {
      if (err != null) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = {
  get: get,
  set: set
}
