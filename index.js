'use strict';

var path = require('path');
var readdirp = require('readdirp');
var fs = require('fs-extra');
var _ = require('underscore');
var utils = require('./lib/utils');


require('./lib/prompt')(function(err, params) {
  if (err) {
    throw err;
  }

  var manifests = [];
  var testlibs = fs.readdirSync(path.join(__dirname, 'templates/test'));

  var stream = readdirp({
    root: path.join(__dirname, 'templates'),
    fileFilter: ['!.DS_Store'],
    // Exclude test templates that haven't been selected.
    directoryFilter: testlibs
      .filter(function(lib) {
        return lib !== params.testlib;
      })
      .map(function(lib) {
        return '!' + lib;
      })
  });

  stream.on('data', function(file) {
    // Change the dest path for test templates.
    // From `test/{testlib}/filename.js` to `test/filename.js`.
    var dest = /test/.test(file.path)
      ? file.path
        .split(path.sep)
        .filter(function(folder) {
          return folder !== params.testlib;
        })
        .join(path.sep)
      : path.resolve(process.cwd(), file.path);

    if (fs.existsSync(dest)) {
      console.warn(file.path, 'already exists');
      return;
    }

    // Store the manifest to render it later (on stream end).
    if (utils.isManifestFile(file)) {
      manifests.push(file);
      return;
    }

    utils.renderFile(file, params, function(data) {
      if (utils.isJsonFile(file)) {
        fs.writeJson(dest, JSON.parse(data));
        return;
      }

      fs.outputFile(dest, data);
    });
  });

  stream.on('end', function() {
    // Render package.json
    var dest = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(dest)) {
      console.warn('package.json already exists');
      return;
    }

    var manifest = {};
    manifests.forEach(function(file) {
      _.extend(
        manifest,
        JSON.parse(utils.renderFileSync(file, params))
      );
    });

    fs.writeJson(dest, manifest);
  });
});
