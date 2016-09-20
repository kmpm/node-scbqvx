var debug = require('debug')('scbqvx:routes:qvx');

var express = require('express');
var router = express.Router();
module.exports = router;

var lib = require('../lib');
var scb = new lib.ScbClient();
var schemas = lib.schemas;

function sendQvx(res, data, schema, name) {
  //debug('schema', schema);
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', 'attachment; filename=' + name + '.qvx;');
  return lib.qvxify(schema, data).pipe(res);
}

function metaAsTable(tableId, data) {
  var result = [];
  data.variables.forEach(function (variable) {
    for(var i = 0; i < variable.values.length; i++) {
      result.push({tableId: tableId, code: variable.code, value: variable.values[i], name: variable.valueTexts[i]});
    }
  });
  debug('generated at table with %s records for %s', result.length, tableId);
  return result;
};

router.get('/meta/:subjectId/:levelId/:tableId', function(req, res, next) {
  scb.getTableMeta(req.params.subjectId, req.params.levelId, req.params.tableId)
  .then(function (data) {
    var table = metaAsTable(req.params.tableId, data);
    return sendQvx(res, table, schemas.metaVariables,  req.params.tableId + '-meta');
  })
  .catch(next);
});


