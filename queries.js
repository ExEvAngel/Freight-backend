var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var config = {
  "USER"  : "angelo",
  "PASS"  : "password",
  "HOST"  : "postgresql1.cmlrmfaa5t5d.ap-southeast-2.rds.amazonaws.com",
  "PORT"  : "5432",
  "DATABASE"  : "postgresql1"
};

var connectionString = 'postgres://'+config.USER+':'+
  config.PASS+'@'+
  config.HOST+':'+
  config.PORT+'/'+
  config.DATABASE;

var db = pgp(connectionString);

function createUserToken(req, res, next) {
  var userid = req.user.email;
  db.none('insert into fcmdb(userid, token)'+
    'values($1, $27)',
    [userid,req.body.token])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted token'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
function updateUserToken(req, res, next) {
  var userid = req.user.email;
  db.none('update fcmdb set token= $1 where userid = $2',
    [req.body.token,userid])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted token'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getToken(req, res, next) {
  var userid = req.user.email;
  db.any('select token from fcmdb where userid = $1', userid)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function getUserToken(req, res, next) {
  var userid = req.params.uid;
  db.any('select token from fcmdb where userid = $1', userid)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeUserToken(req, res, next) {
  var cid = parseInt(req.params.id);
  db.none('delete from pickups where cid = $1', cid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Tracking'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getAllCons(req, res, next) {
  db.any('select * from consignments')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });


}
function getContacts(req, res, next) {
  db.any('select * from contacts')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}
function getUserCons(req, res, next) {
  var userId = req.params.userid;
  db.any('select * from consignments where userid = $1', userId)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function createCon(req, res, next) {
  var conid = parseInt(req.body.conid);
  var nopiece = parseInt(req.body.nopiece);
  var value = parseFloat(req.body.value);
  var userid = req.user.email;
  db.none('insert into consignments(conid, payterm, custref, sendacc, sendname, sendaddress, sendcity, sendpostcode, sendcountry,sendcontactname, sendcontactno,recacc, recname, recaddress, reccity, recpostcode, reccountry, reccontactname, reccontactno,service,opt, dg, nopiece, description, value, currency, userid, parked,creationdate)'+
    'values($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)',
    [conid,req.body.payterm,req.body.custref,req.body.sendacc,req.body.sendname,req.body.sendaddress,req.body.sendcity,req.body.sendpostcode,req.body.sendcountry,req.body.sendcontactname,req.body.sendcontactno,req.body.recacc,req.body.recname,req.body.recaddress,req.body.reccity,req.body.recpostcode,req.body.reccountry,req.body.reccontactname,req.body.reccontactno,req.body.service,req.body.opt,req.body.dg,nopiece,req.body.description,value,req.body.currency, userid ,req.body.parked,req.body.creationdate])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one con'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


function getParkedCons(req, res, next){
  db.any('select * from consignments where parked = true')
    .then(function (data){
      res.status(200)
        .json(data);
    })
    .catch(function (err){
      return next(err);
    })
}

function parkCon(req, res, next) {
  var id = parseInt(req.params.id);
  db.none('update consignments set parked = true where id=$1', id)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Con Parked'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function unParkCon(req, res, next) {
  var id = parseInt(req.params.id);
  db.none('update consignments set parked = false where id=$1', id)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Con unparked'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeCon(req, res, next) {
  var id = parseInt(req.params.id);
  db.result('delete from consignments where id = $1', id)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} cons`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

//Tracking
function getAllConTracking(req, res, next){
  var cid = parseInt(req.params.id);
  db.any('select * from tracking where cid = $1', cid)
    .then(function (data){
      res.status(200)
        .json(data);
    })
    .catch(function (err){
      return next(err);
    })
}



function getAllConByNumTracking(req, res, next){
  var conid = parseInt(req.params.id);
  db.any('select * from tracking where conid = $1', conid)
    .then(function (data){
      res.status(200)
        .json(data);
    })
    .catch(function (err){
      return next(err);
    })
}


function createConTracking(req, res, next) {
  var cid = parseInt(req.params.id);
  var userid = req.user.email;
  var conid = parseInt(req.body.conid);
  db.none('insert into tracking(status, remarks, depot, userid, date, cid, conid)'+
    'values($1, $2, $3, $4,$5, $6, $7)',
    [req.body.status, req.body.remarks, req.body.depot, userid, req.body.date, cid, conid])
    .then(function (data) {
      res.status(200)
        .json({
          data:   data,
          status: 'success',
          message: 'Created Tracking'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeConTracking(req, res, next) {
  var cid = parseInt(req.params.id);
  var tid = parseInt(req.params.tid);
  db.result('delete from tracking where id = $1 and cid = $2', [tid, cid])
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} Tracking`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}

function getPickup(req, res, next) {
  db.any('select cid,conid,sendname,sendaddress,sendcity,sendpostcode,description,nopiece,dg,driver from consignments t1 inner join pickups t2 ON t1.id = t2.cid')
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function createPickup(req, res, next) {
  var cid = parseInt(req.body.cid);
  db.none('insert into pickups(cid, driver, pickup)'+
    'values($1, $2, $3)',[cid, req.body.driver, req.body.pickup])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Created Pickup'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function deletePickup(req, res, next) {
  var cid = parseInt(req.params.id);
  db.none('delete from pickups where cid = $1', cid)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Deleted Pickup'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getDriverPickups(req, res, next) {
  var userId = req.params.userid;
  db.any('select cid,conid,sendname,sendaddress,sendcity,sendpostcode,description,nopiece,dg,driver from consignments t1 inner join pickups t2 ON t1.id = t2.cid where pickup IS NULL and driver=$1', userId)
    .then(function (data) {
      res.status(200)
        .json(data);
    })
    .catch(function (err) {
      return next(err);
    });
}

function rejectDriverPickup(req, res, next) {
  var cid = parseInt(req.params.id);
  var userId = req.params.userid;
  db.none('update pickups set pickup = false where cid = $1 and driver = $2', [cid, userId])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Rejected Pickup'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
function completeDriverPickup(req, res, next) {
  var cid = parseInt(req.params.id);
  var userId = req.params.userid;
  db.none('update pickups set pickup = true where cid = $1 and driver = $2', [cid, userId])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Completed Pickup'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}
function clearDriverPickup(req, res, next) {
  var cid = parseInt(req.params.id);
  var userId = req.params.userid;
  db.none('update pickups set pickup = NULL where cid = $1 and driver = $2', [cid, userId])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Cleared Pickup'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  createUserToken:createUserToken,
  updateUserToken:updateUserToken,
  getToken:getToken,
  getUserToken:getUserToken,
  removeUserToken:removeUserToken,
  getContacts: getContacts,
  getAllCons: getAllCons,
  createCon: createCon,
  getUserCons: getUserCons,
  getParkedCons: getParkedCons,
  parkCon: parkCon,
  unParkCon: unParkCon,
  removeCon: removeCon,
  createConTracking: createConTracking,
  getAllConTracking: getAllConTracking,
  getAllConByNumTracking: getAllConByNumTracking,
  removeConTracking: removeConTracking,
  getPickup: getPickup,
  createPickup: createPickup,
  deletePickup: deletePickup,
  getDriverPickups: getDriverPickups,
  rejectDriverPickup: rejectDriverPickup,
  completeDriverPickup: completeDriverPickup,
  clearDriverPickup: clearDriverPickup,

  /*
  getTrackingDetail: getTrackingDetail,
  updateTrackingDetail: updateTrackingDetail, 

  getSingleCon: getSingleCon,
  createCon: createCon,
  updateCon: updateCon,


router.post('/api/cons/:id/tracking', db.createConTracking);
router.get('/api/cons/:id/tracking', db.getAllConTracking);
router.get('/api/cons/:id/tracking/:tid', db.getTrackingDetail)
router.put('/api/cons/:id/tracking/:tid',db.upDateTrackingDetail);
  */
};
