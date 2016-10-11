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

//var db = pgp("postgres://angelo:password@postgresql1.cmlrmfaa5t5d.ap-southeast-2.rds.amazonaws.com:5432/postgresql1");
//var connectionString = "postgres://angelo:password@postgresql1.cmlrmfaa5t5d.ap-southeast-2.rds.amazonaws.com:5432/postgresql1";
var db = pgp(connectionString);
// add query functions

function getAllCons(req, res, next) {
  db.any('select * from consignments')
    .then(function (data) {
      res.status(200)
        .json({consignments: data});
    })
    .catch(function (err) {
      return next(err);
    });


}

function createCon(req, res, next) {
  req.body.conid = parseInt(req.body.conid);
  req.body.nopiece = parseInt(req.body.nopiece);
  req.body.value = parseFloat(req.body.value);
  db.none('insert into consignments(conid, payterm, custref, sendacc, sendname, sendaddress, sendcity, sendpostcode, sendcountry,sendcontactname, sendcontactno,recacc, recname, recaddress, reccity, recpostcode, reccountry, reccontactname, reccontactno,service,opt, dg, nopiece, description, value, currency, userid, parked,creationdate)'+
    'values($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)',
    [req.body.conid,req.body.payterm,req.body.custref,req.body.sendacc,req.body.sendname,req.body.sendaddress,req.body.sendcity,req.body.sendpostcode,req.body.sendcountry,req.body.sendcontactname,req.body.sendcontactno,req.body.recacc,req.body.recname,req.body.recaddress,req.body.reccity,req.body.recpostcode,req.body.reccountry,req.body.reccontactname,req.body.reccontactno,req.body.service,req.body.opt,req.body.dg,parseInt(req.body.noPiece),req.body.description,parseInt(req.body.value),req.body.currency,req.body.userid,req.body.parked,req.body.creationdate])
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

function getUserCons(req, res, next) {
  var userId = req.params.userid;
  db.any('select * from consignments where userid = $1', userId)
    .then(function (data) {
      res.status(200)
        .json({consignments: data});
    })
    .catch(function (err) {
      return next(err);
    });
}

function getParkedCons(req, res, next){
  db.any('select * from consignments where parked = true')
    .then(function (data){
      res.status(200)
        .json({consignments: data});
    })
    .catch(function (err){
      return next(err);
    })
}

function parkCon(req, res, next) {
  var conid = parseInt(req.params.conid);
  db.none('update consignments set parked= true where conid=$1', conid)
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
  getAllCons: getAllCons,
  createCon: createCon,
  getUserCons: getUserCons,
  getParkedCons: getParkedCons,
  parkCon:parkCon,
  /*getSingleCon: getSingleCon,
  createCon: createCon,
  updateCon: updateCon,
  removeCon: removeCon*/
};
