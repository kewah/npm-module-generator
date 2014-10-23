'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
_.mixin(require('underscore.string').exports());


exports.renderFile = function(file, params, cb) {
  fs.readFile(file.fullPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    cb(_.template(data)(params));
  });
};


exports.renderFileSync = function(file, params) {
  return _.template(fs.readFileSync(file.fullPath, 'utf8'))(params);
};


exports.isManifestFile = function(file) {
  return path.basename(file.name) === 'package.json';
};


exports.isJsonFile = function(file) {
  return path.extname(file.name) === '.json';
};
