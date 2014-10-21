'use strict';

var tape = require('tape');
var <%= _.camelize(moduleName) %> = require('..');

tape('<%= moduleName %>', function(test) {
  test.equal(true, true);
  test.end();
});
