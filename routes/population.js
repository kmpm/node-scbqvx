var express = require('express');
var router = express.Router();
var lib = require('../lib');
var scb = new lib.ScbClient();
var schemas = lib.schemas;
//var debug = require('debug')('scbqvx:routes:population');


function sendQvx(res, data, schema) {
  //debug('schema', schema);
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', 'attachment; filename=' + schema.tableName + '.qvx;');
  return lib.qvxify(schema, data).pipe(res);
}

/* GET home page. */
router.get('/meta', function(req, res, next) {
  scb.populationMeta()
  .then(function (data) {
    res.json(data);
  });
});


router.get('/meta/variables', function(req, res, next) {
  scb.populationMeta()
  .then(function (data) {
    var result = [];
    data.variables.forEach(function (variable) {
      for(var i = 0; i < variable.values.length; i++) {
        result.push({code: variable.code, value: variable.values[i], name: variable.valueTexts[i]});
      }
    });
    
    sendQvx(res, result, schemas.metaVariables);
  })
  .catch(next);
});



module.exports = router;
