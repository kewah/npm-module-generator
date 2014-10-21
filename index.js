'use strict';

var path = require('path');
var readdirp = require('readdirp');
var fs = require('fs-extra');
var _ = require('underscore');
_.mixin(require('underscore.string').exports());

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

      if (path.basename(file.name) === 'package.json') {
        var json = JSON.parse(data);
        var testFolder;

        if (params.testlib !== 'none') {
          testFolder = path.join(__dirname, 'templates/test', params.testlib);

          _.extend(json, fs.readJsonSync(
            path.join(testFolder, 'package.json')
          ));

          renderTestTemplate(testFolder, params);
        }

        fs.writeJson(dest, json);
        return;
      }

      if (path.extname(file.name) === '.json') {
        fs.writeJson(dest, JSON.parse(data));
        return;
      }

      fs.writeFile(dest, data);
    });
  });
});


function renderTestTemplate(root, params) {
  var stream = readdirp({
    root: root,
    fileFilter: ['!.DS_Store', '!package.json']
  });

  stream.on('data', function(file) {
    var dest = path.resolve(process.cwd(), 'test', file.path);

    if (fs.existsSync(dest)) {
      console.warn(file.path, 'already exists');
      return;
    }

    fs.readFile(file.fullPath, 'utf8', function(err, data) {
      if (err) {
        throw err;
      }

      fs.outputFile(dest, _.template(data)(params));
    });
  });
}
