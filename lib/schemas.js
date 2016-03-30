'use strict';

var qvx = require('qvx');
var schemaDate = '2016-03-30 19:05:10';
var schemas = {};



schemas.metaVariables = new qvx.Schema({
  createdAt: schemaDate,
  creator: false,
  tableName: 'metaVariables',
  fields: {
    code: {type: String},
    value: {type: String},
    name: {type: String}
  }
});


module.exports = schemas;