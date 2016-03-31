var express = require('express');
var router = express.Router();
var lib = require('../lib');
module.exports = router;

var scb = new lib.ScbClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('explorer/index', {title: 'scb api exporer'});
});


router.get('/templates/:templateName.html', function (req, res, next) {
  res.render('explorer/templates/' + req.params.templateName);
});


router.get('/subject', function (req, res, next) {
  scb.getSubjectAreas()
  .then(function (data) {
    res.json(data);
  })
  .catch(next);
});

router.get('/subject/:subjectId/level', function (req, res, next) {
  scb.getSubjectLevels(req.params.subjectId)
  .then(function (data) {
    res.json(data);
  })
  .catch(next);
});

router.get('/subject/:subjectId/level/:levelId', function (req, res, next) {
  scb.getLevelTables(req.params.subjectId, req.params.levelId)
  .then(function (data) {
    res.json(data);
  })
  .catch(next);
});

router.get('/subject/:subjectId/level/:levelId/:tableId', function (req, res, next) {
  scb.getTableMeta(req.params.subjectId, req.params.levelId, req.params.tableId)
  .then(function (data) {
    res.json(data);
  })
  .catch(next);
});
