var express = require('express');
var router = express.Router();

var db = require('../queries');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/api/user/fcmtoken', db.createUserToken);
router.put('/api/user/fcmtoken', db.updateUserToken);
router.get('/api/user/fcmtoken', db.getToken);
router.get('/api/user/:uid/fcmtoken', db.getUserToken);
router.put('/api/user/:uid', db.removeUserToken);
router.get('/api/cons', db.getAllCons);
router.post('/api/cons', db.createCon);
router.put('/api/cons', db.editCon);

router.get('/api/user/:userid/cons', db.getUserCons);
router.get('/api/cons/parked', db.getParkedCons);
router.put('/api/cons/:id/park',db.parkCon);
router.put('/api/cons/:id/unpark',db.unParkCon);
router.delete('/api/cons/:id', db.removeCon);
router.post('/api/cons/:id/tracking', db.createConTracking);
router.get('/api/cons/:id/tracking', db.getAllConTracking);
router.get('/api/cons/num/:id/tracking', db.getAllConByNumTracking);
router.delete('/api/cons/:id/tracking/:tid', db.removeConTracking);

router.get('/api/pickup', db.getPickup);
router.post('/api/pickup', db.createPickup);
router.delete('/api/pickup/:id', db.deletePickup);
router.get('/api/pickup/driver/:userid', db.getDriverPickups);
router.put('/api/pickup/:id/driver/:userid/complete', db.completeDriverPickup);
router.put('/api/pickup/:id/driver/:userid/reject', db.rejectDriverPickup);
router.put('/api/pickup/:id/driver/:userid/undo', db.clearDriverPickup);

router.post('/api/cons/:id/image/upload', db.uploadImage);
router.get('/api/cons/:id/image/download', db.downloadImage);
router.get('/api/cons/:id', db.getCon);
/*
router.get('/api/cons/:id/tracking/:tid', db.getTrackingDetail)
router.put('/api/cons/:id/tracking/:tid',db.updateTrackingDetail);*/



module.exports = router;
