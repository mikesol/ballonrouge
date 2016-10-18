// @flow weak

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./redballoon.db');
var CREATE_STMT = "CREATE TABLE IF NOT EXISTS redballoon (key STRING PRIMARY KEY, value STRING)";
db.run(CREATE_STMT);

var get = function(key) {
  return new Promise(function(resolve, reject) {
    db.serialize(function() {
      db.all("SELECT key, value FROM redballoon WHERE key = ?", [key], function(err, rows) {
        if (err != null) {
          reject(err);
        } else if (rows.length === 0) {
          resolve(null);
        } else {
          resolve(rows[0].value);
        }
      });
    });
  });
}

var set = function(key, val) {
  return new Promise(function(resolve, reject) {
    db.serialize(function() {
      db.run("INSERT OR REPLACE INTO redballoon VALUES (?, ?)",[key, val], function(err, res) {
        if (err != null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

module.exports = {
  get: get,
  set: set
}
