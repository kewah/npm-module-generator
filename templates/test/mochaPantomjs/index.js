'use strict';

var assert = require('assert');
var <%= _.camelize(moduleName) %> = require('<%= moduleName %>');

describe('<%= moduleName %>', function() {
  it('should test someting', function(done) {
    assert(true, true);
    done();
  });
});
