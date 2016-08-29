'use strict';

require('mocha');
var assert = require('assert');
var utils = require('..');

describe('readline-utils', function() {
  it('should export an object', function() {
    assert(utils);
    assert.equal(typeof utils, 'object');
  });
});
