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
  req.body.age = parseInt(req.body.age);
  db.none('insert into consignments(conid, payterm, custref, senaAcc, sendname, sendaddress, sendcity, sendpostcode, sendcountry,sendcontactname, sendcontactno,recacc, recName, recaddress, reccity, recpostcode, reccountry, reccontactname, reccontactno,service,opt, dg, noiece, description, value, currency, userid, parked)'+
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

/*
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
  /*getSingleCon: getSingleCon,
  createCon: createCon,
  updateCon: updateCon,
  removeCon: removeCon*/
};
