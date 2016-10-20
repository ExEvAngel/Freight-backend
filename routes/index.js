var express = require('express');
var router = express.Router();

var db = require('../queries');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/cons', db.getAllCons);
router.get('/api/contacts', db.getContacts);
router.post('/api/cons', db.createCon);
router.get('/api/user/:userid/cons', db.getUserCons);
router.get('/api/cons/parked', db.getParkedCons);
router.put('/api/cons/:id/park',db.parkCon);
router.put('/api/cons/:id/unpark',db.unParkCon);
router.delete('/api/cons/:id', db.removeCon);
router.post('/api/cons/:id/tracking', db.createConTracking);
router.get('/api/cons/:id/tracking', db.getAllConTracking);
router.delete('/api/cons/:id/tracking/:tid', db.removeConTracking);
/*
router.get('/api/cons/:id/tracking/:tid', db.getTrackingDetail)
router.put('/api/cons/:id/tracking/:tid',db.updateTrackingDetail);*/



module.exports = router;
