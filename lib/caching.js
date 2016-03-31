'use strict';
var memjs = require('memjs')
var debug = require('debug')('scbqvx:lib:caching');

class Caching {
  constructor(expires) {
    this.mc = memjs.Client.create();
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
      self.mc.set(key, storedValue, function (err, success) {
        if (err) {
          return reject(err);
        }
        if(success) {
          return resolve(value);
        }
        return reject(new Error('Could not set cache'));
      }, timeout);
    });
  }

  remove(key) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.mc.delete(key, function (err, success) {
        if (err) {
          return reject(err);
        }
        if(success) {
          return resolve(null);
        }
        return reject(new Error('Could not remove from cache'));
      })
    });
  }

  get(key) {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.mc.get(key, function (err, val) {
          if (err) {
            return reject(err);
          }
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
