const fs = require('fs');
const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Media = require('./models/mediaModel');

const app = express();

dotenv.config({ path: './.env' });
const DB = process.env.DATABASE;

// mongoose.connect(DB).then(() => {
//   console.log('DB connected successfully!');
// });

var walk = function (dir, done) {
  var results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function (file) {
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('./json/', function (err, results) {
  // throw error if something is wrong
  if (err) throw err;
  mongoose.connect(DB).then(() => {
    console.log('DB connected successfully!');
    results.forEach(function (path) {
      // do stuff with the path
      //   console.log(path);
      // read the json file
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          console.log(err);
          //   throw err;
        }
        // parse the json file
        const records = data.split('\n').map(async function (record) {
          //   return JSON.parse(record);
          //   console.log(JSON.parse(record));
          // check if the record is parsable
          try {
            parsedData = JSON.parse(record);
            const mediaData = await Media.create({
              auctionId: parsedData.auctionId,
              campaignId: parsedData.biddingMainAccount,
              creativeId: parsedData.bidResponseCreativeName,
              adgroupId: parsedData.biddingSubAccount,
              //   userAgent: parsedData.bidRequestString.userAgent,
              //   site: parsedData.bidRequestString.url,
              //   geo:
              //     parsedData.bidRequestString.device.geo.country ||
              //     parsedData.bidRequestString.device.ext.geo_criteria_id,
              //   exchange: parsedData.bidRequestString.exchange,
              price: parsedData.winPrice,
              //   time: parsedData.bidRequestString.timestamp,
            });
            // console.log(mediaData);
            console.log(parsedData);
            // break;
            // console.log(parsedData);
          } catch (e) {
            console.log(e);
            console.log('Not parsed');
          }
        });
      });
    });
  });
});

const PORT = process.env.PORT || 8000 || 80;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on port %s', server.address().port, '...');
});
