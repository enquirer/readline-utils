'use strict';

require('mocha');
var assert = require('assert');
var utils = require('..');

describe('.normalize', function() {
  it('should normalize number events', function() {
    assert.deepEqual(utils.normalize(1), [
      {
        key: {
          name: 'number',
          ctrl: false,
          meta: false,
          shift: false,
          value: 1,
          sequence: '1'
        },
        ch: '1'
      }
    ]);

    assert.deepEqual(utils.normalize('1'), [
      {
        key: {
          name: 'number',
          ctrl: false,
          meta: false,
          shift: false,
          value: '1',
          sequence: '1'
        },
        ch: '1'
      }
    ]);
  });

  it('should normalize alpha character events', function() {
    assert.deepEqual(utils.normalize('a'), [
      {
        key: {
          name: 'a',
          ctrl: false,
          meta: false,
          shift: false,
          value: 'a',
          sequence: 'a'
        },
        ch: 'a'
      }
    ]);
  });

  it('should normalize shift character events', function() {
    assert.deepEqual(utils.normalize('*'), [
      {
        key: {
          name: '*',
          ctrl: false,
          meta: false,
          shift: true,
          value: '*',
          sequence: '*'
        },
        ch: '*'
      }
    ]);
  });

  it('should normalize ctrl character events', function() {
    assert.deepEqual(utils.normalize(utils.key.ctrlc), [
      {
        key: {
          name: 'c',
          ctrl: true,
          meta: false,
          shift: false,
          value: utils.key.ctrlc,
          sequence: utils.key.ctrlc
        },
        ch: utils.key.ctrlc
      }
    ]);
  });

  it('should normalize return events', function() {
    assert.deepEqual(utils.normalize('\r'), [
      {
        key: {
          name: 'return',
          ctrl: false,
          meta: false,
          shift: false,
          value: '\r',
          sequence: '\r'
        },
        ch: '\r'
      }
    ]);
  });

  it('should normalize newline events', function() {
    assert.deepEqual(utils.normalize('\n'), [
      {
        key: {
          name: 'enter',
          ctrl: false,
          meta: false,
          shift: false,
          value: '\n',
          sequence: '\n'
        },
        ch: '\n'
      }
    ]);
  });

  it('should normalize up/down/left/right character events', function() {
    function direction(ch, code) {
      return [
        {
          key: {
            name: ch,
            code: code,
            ctrl: false,
            meta: false,
            shift: false,
            value: utils.key[ch],
            sequence: utils.key[ch]
          },
          ch: utils.key[ch]
        }
      ];
    }

    assert.deepEqual(utils.normalize(utils.key.up), direction('up', '[A'));
    assert.deepEqual(utils.normalize(utils.key.down), direction('down', '[B'));
    assert.deepEqual(utils.normalize(utils.key.right), direction('right', '[C'));
    assert.deepEqual(utils.normalize(utils.key.left), direction('left', '[D'));
  });
});
