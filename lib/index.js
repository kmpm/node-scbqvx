var streamify = require('stream-array');
var qvx = require('qvx');
var debug = require('debug')('scbqvx:lib');


exports.schemas = require('./schemas');
exports.ScbClient = require('./scbclient');

exports.qvxify = function (schema, data) {
  var outbound = new qvx.Outbound(schema);
  return streamify(data)
  .pipe(outbound)
};

exports.filterByCode = function (value) {
  
   function codefilter(obj) {
    debug('obj.hasOwnProperty:%s, obj.code:%s', obj.hasOwnProperty('code'), obj.code);
    if (obj.hasOwnProperty('code') && obj.code === value) {
      return true;
    }
    return false;
  }
  return function (data) { 
    return new Promise(function (resolve, reject) {
      debug('filtering data by code = %s', value);
      if (!(data instanceof Array)) {
        debug('data is not an array', data);
        return reject(new Error('Data is not an array'));
      }
      if (typeof value === 'undefined') {
        return reject(new Error('Value is undefined'));
      }
      
      //filter and return first, should only be one
      data = data.filter(codefilter)[0];
      return resolve(data);
      
    })
  };
};
