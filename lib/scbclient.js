'use strict';
var Client = require('node-rest-client').Client;
var SCB_BASE='http://api.scb.se/OV0104/v1/doris/'
var Caching = require('./caching');
var debug = require('debug')('scbqvx:lib:scbclient');

class ScbClient {
  constructor() {
    this.client = new Client();
    this.cache = new Caching();
  }



  getApi(path) {
    var self = this;
    var key = 'getApi-' + path;
    return self.cache.get(key)
    .then(function (value) {
      return new Promise(function (resolve, reject) {
        if (value === null) {
          var url = SCB_BASE + path;
          debug('no value in cache, getting %s', url)
          self.client.get(url, function (data, response) {
            debug('got something of type %s', typeof data);
            return resolve(data);
          }).on('error', function (err) {
            debug('got an error', err);
            return reject(err);
          });
        }
        else {
          debug('found `%s` in cache', key);
          return resolve(value);
        }
      });
    })
    .then(function (value) {
      debug('key:%s, value type %s', key, typeof value);
      return self.cache.set(key, value);
    });
  }

  getSubjectAreas() {
    return this.getApi('en/ssd');
  }

  getSubjectLevels(subjectId) {
    return this.getApi('en/ssd/' + subjectId);
  }

  getLevelTables(subjectId, levelId) {
    return this.getApi('en/ssd/' + subjectId + '/' + levelId);
  }

  getTableMeta(subjectId, levelId, tableId) {
    return this.getApi('en/ssd/' + subjectId + '/' + levelId + '/' + tableId)
  }

}//-end ScbClient

module.exports = ScbClient;
