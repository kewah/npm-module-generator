'use strict';

var path = require('path');
var readdirp = require('readdirp');
var fs = require('fs-extra');
var _ = require('underscore');

require('./lib/prompt')(function(err, params) {
  if (err) {
    throw err;
  }

  var stream = readdirp({
    root: path.join(__dirname, 'templates'),
    fileFilter: ['!.DS_Store'],
    directoryFilter: ['!test']
  });

  stream.on('data', function(file) {
    var dest = path.resolve(process.cwd(), file.path);

    if (fs.existsSync(dest)) {
      console.warn(file.path, 'already exists');
      return;
    }

    fs.readFile(file.fullPath, 'utf8', function(err, data) {
      if (err) {
        throw err;
      }

      data = _.template(data)(params);

      if (path.extname(file.name) === '.json') {
        fs.writeJson(dest, JSON.parse(data));
        return;
      }

      fs.writeFile(dest, data);
    });
  });
});
