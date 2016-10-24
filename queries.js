var promise = require('bluebird');
var gcm = require('node-gcm');

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

var sender = new gcm.Sender('AIzaSyDUD0RKPApkLijQSIF7FLj3bqsSmbFQoMY')

function createUserToken(req, res, next) {
var userid = req.user.email;
  db.none('insert into fcmdb(userid, token) values($1,$2) ON CONFLICT (userid) DO UPDATE set token=$2;',
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
  db.none('update fcmdb set token = "" where cid = $1', cid)
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
  var status = 'LF';
  var remarks = 'Data completed by '+userid;
  var depot = '';
  db.one('insert into consignments(conid, payterm, custref, sendacc, sendname, sendaddress, sendcity, sendpostcode, sendcountry,sendcontactname, sendcontactno,recacc, recname, recaddress, reccity, recpostcode, reccountry, reccontactname, reccontactno,service,opt, dg, nopiece, description, value, currency, userid, parked,creationdate)'+
    'values($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29) returning id',
    [conid,req.body.payterm,req.body.custref,req.body.sendacc,req.body.sendname,req.body.sendaddress,req.body.sendcity,req.body.sendpostcode,req.body.sendcountry,req.body.sendcontactname,req.body.sendcontactno,req.body.recacc,req.body.recname,req.body.recaddress,req.body.reccity,req.body.recpostcode,req.body.reccountry,req.body.reccontactname,req.body.reccontactno,req.body.service,req.body.opt,req.body.dg,nopiece,req.body.description,value,req.body.currency, userid ,req.body.parked,req.body.creationdate])
  .then(function (data) {
    var id = data.id
    console.log(id);
    db.none('insert into tracking(status, remarks, depot, userid, date, cid, conid)'+
    'values($1, $2, $3, $4,$5, $6, $7)',
    [status,remarks,depot,userid,req.body.creationdate,id, conid])
    }).then(function () {
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

function editCon(req, res, next){
  var id = parseInt(req.body.id)
  var conid = parseInt(req.body.conid);
  var nopiece = parseInt(req.body.nopiece);
  var value = parseFloat(req.body.value);
  db.none('update consignments set conid = $1, payterm = $2, custref = $3, sendacc=$4, sendname=$5, sendaddress=$6, sendcity=$7, sendpostcode=$8, sendcountry=$9,sendcontactname=$10, sendcontactno=$11,recacc=$12, recname=$13, recaddress=$14, reccity=$15, recpostcode=$16, reccountry=$17, reccontactname=$18, reccontactno=$19,service=$20,opt=$21, dg=$22, nopiece=$23, description=$24, value=$25, currency=$26, userid=$27, parked=$28,creationdate=$29 where id = $30 ',
    [conid,req.body.payterm,req.body.custref,req.body.sendacc,req.body.sendname,req.body.sendaddress,req.body.sendcity,req.body.sendpostcode,req.body.sendcountry,req.body.sendcontactname,req.body.sendcontactno,req.body.recacc,req.body.recname,req.body.recaddress,req.body.reccity,req.body.recpostcode,req.body.reccountry,req.body.reccontactname,req.body.reccontactno,req.body.service,req.body.opt,req.body.dg,nopiece,req.body.description,value,req.body.currency, req.body.userid ,req.body.parked,req.body.creationdate, id])
    .then(function () {
      res.status(200)
      .json({
        status: 'success',
        message: 'Updated puppy'
      });
    })
    .catch(function (err){
      return next(err);
    });
}


function getCon(req, res, next){
  var id = parseInt(req.params.id);
  db.one('select * from consignments where id = $1',id)
    .then(function (data){
      res.status(200)
        .json(data);
    })
    .catch(function (err){
      return next(err);
    })
}

function uploadImage(req, res, next){
  db.any('select * from consignments where parked = true')
    .then(function (data){
      res.status(200)
        .json(data);
    })
    .catch(function (err){
      return next(err);
    })
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
  var userid = req.body.userid;
  var message = new gcm.Message();
  
  db.tx(function(t1){
    return t1.batch([
      t1.none('update consignments set parked = true where id=$1', id),
      t1.one('select token from fcmdb where userid = $1', userid)
      ]);
  })
  .then(function (token) {
        var regTokens = [token[1].token];
        message.addNotification('title', 'Consignment Held '+req.body.conid);
        message.addNotification('body', req.body.remarks );
        message.addNotification('click_action','com.angel.createcon.ConsignmentDetail_TARGETNOTIFICATION');
        message.addNotification('icon', 'ic_launcher');
        message.addData('id',req.body.cid);
        message.addData('conid',req.body.conid);
        console.log(token[1].token);
        console.log(message);
        console.log(sender);
        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
        if (err) console.error(err);
          else console.log(response);
        });

    }).then(function(){
      res.status(200)
        .json({
          status: 'success',
          message: 'Con parked'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function unParkCon(req, res, next) {
  var id = parseInt(req.params.id);
  var userid = req.body.userid;
  var message = new gcm.Message();
    db.tx(function(t1){
    return t1.batch([
      t1.none('update consignments set parked = false where id=$1', id),
      t1.one('select token from fcmdb where userid = $1', userid)
      ]);
  }).then(function (token) {
        var regTokens = [token[1].token];
        message.addNotification('title', 'Consignment Held '+req.body.conid);
        message.addNotification('body', req.body.remarks );
        message.addNotification('click_action','com.angel.createcon.ConsignmentDetail_TARGETNOTIFICATION');
        message.addNotification('icon', 'ic_launcher');
        message.addData('id',req.body.cid);
        message.addData('conid',req.body.conid);
        console.log(token[1].token);
        console.log(message);
        console.log(sender);
        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
        if (err) console.error(err);
          else console.log(response);
        });

    })
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
  uploadImage:uploadImage,
  createUserToken:createUserToken,
  updateUserToken:updateUserToken,
  getCon:getCon,
  getToken:getToken,
  getUserToken:getUserToken,
  removeUserToken:removeUserToken,
  getContacts: getContacts,
  getAllCons: getAllCons,
  createCon: createCon,
  editCon:editCon,
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
