const fs = require('fs');
const path = require('path');
const gunzip = require('gunzip-file');

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

walk('raw-bid-win (1)', function (err, results) {
  // throw error if something is wrong
  if (err) throw err;

  results.forEach(function (filePath) {
    fs.lstat(filePath, (err, stats) => {
      if (err) return console.log(err); //Handle error

      //   console.log(`Is file: ${stats.isFile()}`);
      if (stats.isFile() && path.extname(filePath) === '.gz') {
        // get the last index of split
        const file = filePath.split('/')[filePath.split('/').length - 1];
        //   console.log(file);
        if (file.indexOf('_') !== 1) {
          //   console.log(file);
          const fileName = file.split('.')[0];
          gunzip(filePath, `./json/${fileName}`, () => {
            console.log('gunzip done!');
          });

          //     // console.log('This is called when the extraction is completed.');
        }
      }
    });

    // console.log(path);
  });
});
