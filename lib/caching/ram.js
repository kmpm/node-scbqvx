'use strict';

var debug = require('debug')('scbqvx:lib:caching:ram');

class Caching {
  constructor(expires) {
    this.cache = {};
    this.expires = expires || 60;
  }

  set(key, value, timeout) {
    var self = this;
    timeout = timeout || this.expires;
    return new Promise(function (resolve, reject) {
      var storedValue = value;
      if (typeof storedValue !== 'string') {
        storedValue = JSON.stringify(value);
      }
      process.nextTick(function () {
          self.cache[key] = storedValue;
          return resolve(value);
      });
    });
  }

  remove(key) {
    var self = this;
    return new Promise(function (resolve, reject) {
      process.nextTick(function () {
        delete self[key];
        return resolve(null);
      })
    });
  }

  get(key) {
    var self = this;
    return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (!self.cache.hasOwnProperty('key')) {
            //return reject(new Error('Key not found'));
            return resolve(null);
          }
          var val = self.cache[key];
          if (val !== null) {
            debug('found value for %s in cache', key);
            val = val.toString();
            if (['[', '{'].indexOf(val.substr(0, 1)) > -1) {
              debug('parse as JSON');
              val = JSON.parse(val);
            }
          }
          return resolve(val);
        });
    });
  }
}

module.exports = Caching;
