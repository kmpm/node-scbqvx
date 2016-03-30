'use strict';
var Client = require('node-rest-client').Client;


class ScbClient {
  constructor() {
    this.client = new Client();
    this.client.registerMethod('getPopulationMeta', 'http://api.scb.se/OV0104/v1/doris/sv/ssd/BE/BE0101/BE0101A/BefolkningNy', 'GET');

    this.cache = {};

  }

  setCache(key, value) {
    this.cache[key] = value;
  }

  clearCache(key) {
    delete this.cache[key];
  }

  getCache(key) {
    return this.cache[key];
  }

  populationMeta() {
    var self = this;
    var key = 'populationMeta';
    return new Promise(function (resolve, reject) {
      if (!self.getCache(key)) {
        self.client.methods.getPopulationMeta(function (data, response) {
          self.setCache(key, data);
          return resolve(data);
        }).on('error', function (err) {
          self.clearCache(key);
          return reject(err);
        })
      }
      else {
        return resolve(self.getCache(key));
      }
    });
  }//-end populationMeta

}//-end ScbClient

module.exports = ScbClient;
