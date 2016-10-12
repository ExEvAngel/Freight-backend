var express = require('express');
var router = express.Router();

var db = require('../queries');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/cons', db.getAllCons);
router.post('/api/cons', db.createCon);
router.get('/api/user/:userid/cons', db.getUserCons);
router.get('/api/cons/parked', db.getParkedCons);
router.put('/api/cons/:conid/park',db.parkCon);
router.put('/api/cons/:conid/unpark',db.unParkCon);
router.delete('/api/cons/:conid', db.removeCon)

/*
router.get('/api/create/:id', db.getSinglePuppy);
router.post('/api/puppies', db.createPuppy);
router.put('/api/puppies/:id', db.updatePuppy);
router.delete('/api/puppies/:id', db.removePuppy);*/


module.exports = router;
