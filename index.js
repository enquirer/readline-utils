'use strict';

var get = require('get-value');
var isNumber = require('is-number');
var extend = require('extend-shallow');
var MuteStream = require('mute-stream');
var readline = require('readline');

/**
 * Move cursor up, down, left or right by `1` line.
 * ```js
 * var utils = require('readline-utils');
 * var rl = utils.createInterface();
 * rl.input.on('keypress', function() {
 *   utils.move(rl, )
 * });
 * ```
 * @param {Readline} `rl` Readline interface
 * @api public
 */

exports.move = function(rl, key) {
  if (key && exports[key.name]) {
    exports[key.name](rl, 1);
  }
};

/**
 * Callback function for the `keypress` event, to automatically move cursor
 * up, down, left or right by `1` line.
 *
 * ```js
 * var utils = require('readline-utils');
 * var rl = utils.createInterface();
 * rl.input.on('keypress', utils.auto(rl));
 * ```
 * @param {Readline} `rl` Readline interface
 * @api public
 */

exports.auto = function(rl) {
  return function(s, key) {
    exports.move(rl, key);
  }
};

/**
 * Move cursor up by `n` lines.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Lines up to move. Default is `1`.
 * @api public
 */

exports.up = function(rl, n) {
  readline.moveCursor(rl.output, 0, -n || 1);
};

/**
 * Move cursor down by `n` lines.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Lines down to move. Default is `1`.
 * @api public
 */

exports.down = function(rl, n) {
  readline.moveCursor(rl.output, 0, n || 1);
};

/**
 * Move cursor left by `n` colums.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Characters to move left. Default is `1`.
 * @api public
 */

exports.left = function(rl, n) {
  readline.moveCursor(rl.output, -n || 1, 0);
};

/**
 * Move cursor right by `n` colums.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Characters to move right. Default is `1`.
 * @api public
 */

exports.right = function(rl, n) {
  readline.moveCursor(rl.output, n || 1, 0);
};

/**
 * Clear the terminal.
 * @param {Readline} `rl` Readline interface
 * @api public
 */

exports.clearScreen = function(rl) {
  rl.write(null, {ctrl: true, name: 'l'});
};

/**
 * Create a readline interface with the given `options`.
 * @param {Object} `options`
 * @api public
 */

exports.createInterface = function(options) {
  var opts = exports.createOptions(options);

  var ms = new MuteStream();
  ms.pipe(opts.output);
  opts.output = ms;

  if (!opts.hasOwnProperty('terminal')) {
    opts.terminal = true;
  }

  readline.emitKeypressEvents(opts.input);
  if (opts.input.isTTY) {
    opts.input.setRawMode(true);
  }

  var rl = readline.createInterface(opts);
  rl.paused = false;

  opts.input.on('keypress', function(s, key) {
    if (key && key.name === 'c' && key.ctrl === true) {
      rl.output.write('\n');
    }
  });

  rl.on('pause', function() {
    rl.paused = true;
    exports.close(rl);
  });

  rl.on('resume', function() {
    rl.paused = false;
  });

  return rl;
};

/**
 * Create default options
 */

exports.createOptions = function(options) {
  var opts = extend({}, options);
  opts.output = opts.output || process.stdout;
  opts.input = opts.input || process.stdin;
  return opts;
};

/**
 * Close the interface, remove event listeners, and restore/unmute
 * prompt functionality
 */

exports.initEvents = function(rl) {
  if (exports.isPaused(rl)) rl.resume();
  var fn = exports.forceClose.bind(exports, rl);
  rl.on('SIGINT', fn);
  process.on('exit', fn);
};

/**
 * Close the interface, remove event listeners, and restore/unmute
 * prompt functionality
 */

exports.close = function(rl) {
  var fn = exports.forceClose.bind(exports, rl);
  process.removeListener('exit', fn);
  rl.removeListener('SIGINT', fn);
  if (typeof rl.output.unmute === 'function') {
    rl.output.unmute();
    rl.output.end();
  }
  rl.pause();
  rl.close();
};

/**
 * Close the interface when the keypress is `^C`
 */

exports.forceClose = function(rl) {
  exports.close(rl);
};

/**
 * Close the interface when the keypress is `^C`
 */

exports.isPaused = function(rl) {
  return typeof rl.paused === 'undefined' || rl.isPaused === true;
};

/**
 * Normalize keypress events
 */

exports.normalize = function(event) {
  event = extend({key: {}}, event);
  var is = isKey(event);
  if (!event.key.name || is('enter') || is('return')) {
    return event;
  }
  if (is('up') || is('k') || (is('p') && event.key.ctrl)) {
    event.key.name = 'up';
  }
  if (is('down') || is('j') || (is('n') && event.key.ctrl)) {
    event.key.name = 'down';
  }
  if (isNumber(event.value) && !/^\s+$/.test(String(event.value))) {
    event.value = Number(event.value);
    event.key.name = 'number';
  }
  return event;
};

function isKey(event) {
  return function(key) {
    return get(event, 'key.name') === key;
  };
}
