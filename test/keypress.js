'use strict';

require('mocha');
var assert = require('assert');
var utils = require('..');

function listen(val, num, cb) {
  var events = [];
  var count = 0;

  process.stdin.on('keypress', function(str, key) {
    events.push({val: str, key: key});
    count++;
  });

  utils.emitKey(process.stdin, val);
  process.stdin.removeAllListeners();
  assert.strictEqual(count, num);
  cb(events);
}

describe('.keypress', function() {
  beforeEach(function() {
    utils.keypress(process.stdin);
    process.stdin.setRawMode(true);
  });

  it('should normalize number events', function(cb) {
    listen(9, 1, function(events) {
      assert.strictEqual(events[0].val, '9');
      cb();
    });
  });

  it('should add original value to key.value', function(cb) {
    listen(9, 1, function(events) {
      assert.strictEqual(events[0].key.value, 9);
      cb();
    });
  });

  it('should normalize newline events', function(cb) {
    listen('\n', 1, function(events) {
      assert.strictEqual(events[0].val, '\n');
      assert.strictEqual(events[0].key.name, 'enter');
      cb();
    });
  });

  it('should normalize carriage return events', function(cb) {
    listen('\r', 1, function(events) {
      assert.strictEqual(events[0].val, '\r');
      assert.strictEqual(events[0].key.name, 'return');
      cb();
    });
  });

  it('should emit multiple events for multiple characters', function(cb) {
    listen('bar', 3, function(events) {
      assert.strictEqual(events[0].val, 'b');
      assert.strictEqual(events[0].key.name, 'b');

      assert.strictEqual(events[1].val, 'a');
      assert.strictEqual(events[1].key.name, 'a');

      assert.strictEqual(events[2].val, 'r');
      assert.strictEqual(events[2].key.name, 'r');
      cb();
    });
  });

  it('should normalize shift character events', function(cb) {
    listen('@', 1, function(events) {
      assert.strictEqual(events[0].key.shift, true);
      assert.strictEqual(events[0].key.name, '@');
      assert.strictEqual(events[0].val, '@');
    });

    listen('!', 1, function(events) {
      assert.strictEqual(events[0].key.shift, true);
      assert.strictEqual(events[0].key.name, '!');
      assert.strictEqual(events[0].val, '!');
    });

    listen('*', 1, function(events) {
      assert.strictEqual(events[0].key.shift, true);
      assert.strictEqual(events[0].key.name, '*');
      assert.strictEqual(events[0].val, '*');
      cb();
    });
  });
});
