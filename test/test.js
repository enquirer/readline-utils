'use strict';

require('mocha');
var assert = require('assert');
var utils = require('..');

function override(obj) {
  var getWindowSize = obj.getWindowSize;
  var columns = obj.columns;
  var rows = obj.rows;

  obj.getWindowSize = null;
  obj.columns = null;
  obj.rows = null;

  return function() {
    obj.getWindowSize = getWindowSize;
    obj.columns = columns;
    obj.rows = rows;
  };
}

describe('readline-utils', function() {
  it('should export an object', function() {
    assert(utils);
    assert.equal(typeof utils, 'object');
  });

  it('should get the window width', function() {
    assert.equal(typeof utils.cliWidth(), 'number');
  });
});
