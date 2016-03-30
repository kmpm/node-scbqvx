var express = require('express');
var router = express.Router();
var ScbClient = require('../lib/scbclient');

var scb = new ScbClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  scb.populationMeta()
  .then(function (data) {
    res.json(data)
  })
});

router.get('/meta/variables', function(req, res, next) {
  scb.populationMeta()
  .then(function (data) {
    var result = data.variables.map(function(x) {
      return {code: x.code, text: x.text};
    });
    res.json(result);
  })
});

module.exports = router;
