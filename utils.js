'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('arr-flatten', 'flatten');
require('cli-width');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('is-number');
require('is-windows');
require('mute-stream', 'MuteStream');
require('ttys');
require = fn;

utils.last = function(arr) {
  return arr[arr.length - 1];
};

utils.number = function(n) {
  return utils.isNumber(n) ? n : 1;
};

/**
 * Returns a convenience function for checking the value of `event.key.name`
 */

utils.isKey = function(event) {
  return function(key) {
    return utils.get(event, 'key.name') === key;
  };
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
