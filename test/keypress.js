'use strict';

require('mocha');
var readline = require('readline');
var assert = require('assert');
var utils = require('..');

function listen(val, num, cb) {
  var events = [];
  var count = 0;

  process.stdin.on('keypress', function(name, key) {
    events.push({name: name, key: key});
    count++;
  });

  utils.emitKeypress(process.stdin, val);
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
      assert.strictEqual(events[0].name, 'number');
      assert.strictEqual(events[0].key.value, 9);
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
      assert.strictEqual(events[0].name, 'enter');
      assert.strictEqual(events[0].key.name, 'enter');
      assert.strictEqual(events[0].key.value, '\n');
      cb();
    });
  });

  it('should normalize carriage return events', function(cb) {
    listen('\r', 1, function(events) {
      assert.strictEqual(events[0].name, 'return');
      assert.strictEqual(events[0].key.name, 'return');
      assert.strictEqual(events[0].key.value, '\r');
      cb();
    });
  });

  it('should emit multiple events for multiple characters', function(cb) {
    // . , - \ / ; = [ ] ` ';
    var fixture = 'foo.bar[\'baz-qux\'] = \'path/to\\file-a.js,path/to\\file-b.js\';';
    var len = fixture.length;
    listen(fixture, len, function(events) {
      for (var i = 0; i < len; i++) {
        var char = fixture.charAt(i);
        if (char === ' ') continue;
        assert.strictEqual(events[i].name, char);
        assert.strictEqual(events[i].key.name, char);
      }
      cb();
    });
  });

  it('should normalize shift character events', function(cb) {
    listen('@', 1, function(events) {
      assert.strictEqual(events[0].key.shift, true);
      assert.strictEqual(events[0].key.name, '@');
      assert.strictEqual(events[0].name, '@');
    });

    listen('!', 1, function(events) {
      assert.strictEqual(events[0].key.shift, true);
      assert.strictEqual(events[0].key.name, '!');
      assert.strictEqual(events[0].name, '!');
    });

    listen('*', 1, function(events) {
      assert.strictEqual(events[0].key.shift, true);
      assert.strictEqual(events[0].key.name, '*');
      assert.strictEqual(events[0].name, '*');
      cb();
    });
  });
});
