'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
_.mixin(require('underscore.string').exports());


exports.renderFile = function(file, params, cb) {
  fs.readFile(file.fullPath, 'utf8', function(err, data) {
    if (err) throw err;

    cb(_.template(data)(params));
  });
};


exports.renderFileSync = function(file, params) {
  return _.template(fs.readFileSync(file.fullPath, 'utf8'))(params);
};


exports.isTestTemplate = function(file) {
  return /test/.test(file.path);
};


exports.isManifestFile = function(file) {
  return path.basename(file.name) === 'package.json';
};


exports.isJsonFile = function(file) {
  return path.extname(file.name) === '.json';
};


exports.isDotfileTemplate = function(file) {
  return file.name[0] === '_';
};


/**
 * Change the dest path for test templates.
 * From `test/{testlib}/filename.js` to `test/filename.js`.
 */
exports.toTestPath = function(file, testlib) {
  return file.path
    .split(path.sep)
    .filter(function(folder) {
      return folder !== testlib;
    })
    .join(path.sep);
};


/**
 * Change the path for dotfile templates.
 * from _dotfile to .dotfile
 */
exports.toDotfilePath = function(file) {
  return path.join(
    path.dirname(file.path), '.' + file.name.substr(1)
  );
};
