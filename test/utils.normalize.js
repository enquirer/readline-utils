'use strict';

require('mocha');
var assert = require('assert');
var utils = require('..');
// { key:
//    { sequence: '\u001b[A',
//      name: 'up',
//      ctrl: false,
//      meta: false,
//      shift: false,
//      code: '[A' },
//   value: undefined }
// { key:
//    { sequence: '\u001b[B',
//      name: 'down',
//      ctrl: false,
//      meta: false,
//      shift: false,
//      code: '[B' },
//   value: undefined }
// { key:
//    { sequence: '\u0003',
//      name: 'c',
//      ctrl: true,
//      meta: false,
//      shift: false },
//   value: '\u0003' }

describe('.normalize', function() {
  it('should export an object', function() {
    assert.equal(typeof utils, 'object');
  });
});

