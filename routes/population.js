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
  })
});



router.get('/meta/variables/:code', function(req, res, next) {
  scb.populationMeta()
  .then(function (data) {
    return lib.filterByCode(req.params.code)(data.variables);
  })
  .then(function (data) {
    var result = [];
    for(var i = 0; i < data.values.length; i++) {
      result.push({value: data.values[i], name: data.valueTexts[i]});
    }
    sendQvx(res, result, schemas.metaVariableValues);
  })
  .catch(next);
});


router.get('/meta/variables', function(req, res, next) {
  scb.populationMeta()
  .then(function (data) {
    var result = data.variables.map(function(x) {
      return {code: x.code, text: x.text};
    });
    
    sendQvx(res, result, schemas.metaVariables);
  })
  .catch(next);
});



module.exports = router;
