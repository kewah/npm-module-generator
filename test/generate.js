/*global describe, beforeEach, afterEach, it*/
'use strict';

var fs = require('fs-extra');
var path = require('path');
var assert = require('chai').assert;
var _ = require('underscore');
var generate = require('../lib/generate');
var root = path.resolve(__dirname, '../tmp');

describe('generate()', function() {
  beforeEach(function() {
    fs.mkdirsSync(root);
  });

  afterEach(function() {
    fs.removeSync(root);
  });

  it('should generate a basic JavaScript module', function(done) {
    generate(null, mockPrompt(), function() {
      assertFileExists('index.js');
      assertFileExists('LICENSE');
      assertFileExists('README.md');
      assertFileExists('package.json');
      assertFileExists('.editorconfig');
      assertFileExists('.gitignore');
      assertFileExists('.npmignore');

      var assertPropExists = assertPackage();
      assertPropExists('name');
      assertPropExists('version');
      assertPropExists('description');
      assertPropExists('main');
      assertPropExists('keywords');
      assertPropExists('license');
      assertPropExists('author');
      assertPropExists('homepage');
      assertPropExists('repository');
      assertPropExists('repository.type');
      assertPropExists('repository.url');
      assertPropExists('bugs.url');

      done();
    });
  });

  it('should generate a module with mocha test', function(done) {
    generate(null, mockPrompt({testlib: 'mocha'}), function() {
      assertFileExists('test/index.js');

      var assertPropExists = assertPackage();
      assertPropExists('scripts.test');
      assertPropExists('devDependencies.mocha');

      done();
    });
  });

  it('should generate a module with mocha-phantomjs test', function(done) {
    generate(null, mockPrompt({testlib: 'mochaPantomjs'}), function() {
      assertFileExists('test/index.js');

      var assertPropExists = assertPackage();
      assertPropExists('scripts.test');
      assertPropExists('devDependencies.mocha-phantomjs');

      done();
    });
  });
});

function mockPrompt(params) {
  return _.defaults(params || {}, {
    destination: root,
    moduleName: 'test',
    description: 'description test',
    keywords: JSON.stringify(['key1', 'key2'], null, 2),
    author: 'author name',
    email: 'email@internet.com',
    url: 'url.com',
    github: 'githubname',
    testlib: 'none'
  });
}

function assertFileExists(filename) {
  assert(
    fs.existsSync(path.join(root, filename)),
    'Expected ' + filename + ' to be generated'
  );
}

function assertPackage() {
  var pkg = fs.readJsonSync(path.join(root, 'package.json'));

  return function(prop) {
    assert.deepProperty(
      pkg,
      prop,
      'Expected package.json to have a ' + prop + ' property'
    );
  };
}
