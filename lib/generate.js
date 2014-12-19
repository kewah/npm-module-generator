'use strict';

var path = require('path');
var readdirp = require('readdirp');
var fs = require('fs-extra');
var _ = require('underscore');
var utils = require('./utils');
var templatesDir = path.join(__dirname, '../templates');

module.exports = function(err, params, next) {
  if (err) throw err;

  var destination = params.destination || process.cwd();
  var manifests = [];
  var testlibs = fs.readdirSync(path.join(templatesDir, 'test'));

  var stream = readdirp({
    root: templatesDir,
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

  stream.on('data', renderFile);
  stream.on('end', renderPackageJson);

  function renderFile(file) {
    var dest;

    if (utils.isTestTemplate(file)) {
      dest = utils.toTestPath(file, params.testlib);
    } else if (utils.isDotfileTemplate(file)) {
      dest = utils.toDotfilePath(file);
    }

    dest = path.resolve(destination, dest || file.path);

    if (fs.existsSync(dest)) {
      console.warn(file.path, 'already exists');
      return;
    }

    // Store the manifest to render it later (on stream end).
    if (utils.isManifestFile(file)) {
      manifests.push(file);
      return;
    }

    var data = utils.renderFileSync(file, params);

    if (utils.isJsonFile(file)) {
      fs.writeJson(dest, JSON.parse(data));
      return;
    }

    fs.outputFile(dest, data);
  }

  function renderPackageJson() {
    var dest = path.resolve(destination, 'package.json');
    if (fs.existsSync(dest)) {
      console.warn('package.json already exists');
      next();
      return;
    }

    var manifest = {};
    manifests.forEach(function(file) {
      _.extend(
        manifest,
        JSON.parse(utils.renderFileSync(file, params))
      );
    });

    fs.writeJson(dest, manifest, next);
  }
};
