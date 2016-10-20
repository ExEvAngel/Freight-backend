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
// add query functions

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
          message: 'Updated Tracking'
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

/*

function createCon(req, res, next) {
  req.body.age = parseInt(req.body.age);
  db.none('insert into consignments(conid, payterm, custref, sendacc, sendname, sendaddress, sendcity, sendpostcode, sendcountry,sendcontactname, sendcontactno,recacc, recname, recaddress, reccity, recpostcode, reccountry, reccontactname, reccontactno,service,opt, dg, nopiece, description, value, currency, userid, parked,creationdate)'+
    'values(${conid}, ${payterm}, ${custref}, ${sendacc},${sendname},${sendaddress},${sendcity},${sendpostcode},${sendcountry},${sendcontactname},${sendcontactno},${recacc},${recname},${recaddress},${reccity},${recpostcode},${reccountry},${reccontactname},${reccontactno},${service},${opt},${dg},${nopiece},${description},${value},${curency},${userid},${parked})',
      req.body)
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
function getSinglePuppy(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.one('select * from pups where id = $1', pupID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updatePuppy(req, res, next) {
  db.none('update pups set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
    [req.body.name, req.body.breed, parseInt(req.body.age),
      req.body.sex, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated puppy'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removePuppy(req, res, next) {
  var pupID = parseInt(req.params.id);
  db.result('delete from pups where id = $1', pupID)
    .then(function (result) {
      /* jshint ignore:start *//*
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} puppy`
        });
      /* jshint ignore:end *//*
    })
    .catch(function (err) {
      return next(err);
    });
}*/


module.exports = {
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
