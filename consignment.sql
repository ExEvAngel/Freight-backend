BEGIN TRANSACTION;
DROP DATABASE IF EXISTS freightforward;
CREATE DATABASE freightforward;

DROP TABLE IF EXISTS consignments;
CREATE TABLE consignments (
  ID SERIAL PRIMARY KEY,
  conId INTEGER,
  payTerm VARCHAR,
  custRef VARCHAR,
  sendAcc VARCHAR,
  sendName VARCHAR,
  sendAddress VARCHAR,
  sendCity VARCHAR,
  sendPostCode VARCHAR,
  sendCountry VARCHAR,
  sendContactName VARCHAR,
  sendContactNo VARCHAR,
  recAcc VARCHAR,
  recName VARCHAR,
  recAddress VARCHAR,
  recCity VARCHAR,
  recPostCode VARCHAR,
  recCountry VARCHAR,
  recContactName VARCHAR,
  recContactNo VARCHAR,
  service VARCHAR,
  opt VARCHAR,
  dg BOOLEAN NOT NULL DEFAULT FALSE,
  noPiece INTEGER,
  description VARCHAR,
  value DECIMAL,
  currency VARCHAR,
  userId VARCHAR,
  parked BOOLEAN NOT NULL DEFAULT FALSE,
  creationDate VARCHAR
);

INSERT INTO consignments (conId, payTerm, custRef, sendAcc, sendName, sendAddress, sendCity, sendPostCode, sendCountry,
sendContactName, sendContactNo, recAcc, recName, recAddress, recCity, recPostCode, recCountry, recContactName, recContactNo, service, 
opt, dg, noPiece, description, value, currency, userId, parked, creationdate)
  VALUES ('123456789', 'S', 'testCon', 123456, 'Raymond', '12 Bulter Road', 'Pemulwuy', '2145', 'Australia', 'Angel', '0412345678', 'NK',
  'Jude', '12 Butler Road', 'Pemulwuy', '2145', 'Australia','Mark', '0412345679', '15N', 'Priority', FALSE, 1, 'Documents', 100.00, 'AUD',
  'J360MYE', FALSE,'Oct 11, 2016 4:37:15 PM');

INSERT INTO consignments (conId, payTerm, custRef, sendAcc, sendName, sendAddress, sendCity, sendPostCode, sendCountry,
sendContactName, sendContactNo, recAcc, recName, recAddress, recCity, recPostCode, recCountry, recContactName, recContactNo, service, 
opt, dg, noPiece, description, value, currency, userId, parked, creationdate)
  VALUES ('123456789', 'S', 'testCon', 123456, 'Mark', '12 Bulter Road', 'Pemulwuy', '2145', 'Australia', 'Angel', '0412345678', 'NK',
  'Jude', '12 Butler Road', 'Pemulwuy', '2145', 'Australia','IronMan', '0412345679', '15N', 'Priority', FALSE, 1, 'Documents', 100.00, 'AUD',
  'E007TYE', FALSE,'Oct 11, 2016 4:37:15 PM');


  COMMIT;


  status, remarks, depot, userid, date, cid, con

DROP TABLE IF EXISTS tracking;
CREATE TABLE tracking (
  ID SERIAL PRIMARY KEY,
  status VARCHAR,
  remarks VARCHAR,
  depot VARCHAR,
  userid VARCHAR,
  date  date,
  cid INTEGER
  connote, INTEGER,
  );

DROP TABLE IF EXISTS pickups;
CREATE TABLE pickups (
  cid INTEGER,
  driver VARCHAR,
  pickup BOOLEAN
  );

INSERT INTO pickups(cid, driver) VALUES (19,'test@example.com');


DROP TABLE IF EXISTS fcmdb;
CREATE TABLE fcmdb (
  userid VARCHAR PRIMARY KEY,
  token VARCHAR
  );

INSERT INTO fcmdb(userid, token)VALUE ("test@example.com","fwLv8FphExE:APA91bFj1IEVV4r5yB19-XnM5pVWqdiIIKj99FPWI8dEiiit83afCfJqBL2SOJZYNvuqOCnzOlm-j3w06FIoFrDvMFx26QmgbcdFBcXZsBm1cz7k6U6jPj0dsjVI3xuv69R-esdPc1o8")


DROP TABLE IF EXISTS files;
CREATE TABLE files (
  id INTEGER PRIMARY KEY,
  filename VARCHAR,
  file VARCHAR,
  conid INTEGER,
  userid VARCHAR 
  );
