'use strict';

const readline = require('readline');
const utils = require('./utils');

/**
 * Create default options
 */

exports.createOptions = function(options) {
  var opts = utils.extend({}, options);
  opts.output = opts.output || utils.ttys.stdout;
  opts.input = opts.input || utils.ttys.stdin;
  if (!opts.hasOwnProperty('terminal')) {
    opts.terminal = true;
  }
  return opts;
};

/**
 * Create a readline interface with the given `options`.
 * @param {Object} `options`
 * @api public
 */

exports.createInterface = function(options) {
  var opts = exports.createOptions(options);
  var ms = new utils.MuteStream();
  ms.pipe(opts.output);
  opts.output = ms;

  readline.emitKeypressEvents(opts.input);
  if (opts.input.isTTY) {
    opts.input.setRawMode(true);
  }

  return readline.createInterface(opts);
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
  return exports;
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
  return exports;
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
  return exports;
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
  return exports;
};

/**
 * Move cursor up, down, left or right by `1` line.
 *
 * ```js
 * var utils = require('readline-utils');
 * var rl = utils.createInterface();
 * rl.input.on('keypress', function(str, key) {
 *   utils.move(rl, key);
 * });
 * ```
 * @param {Readline} `rl` Readline interface
 * @api public
 */

exports.move = function(rl, key) {
  if (key && exports[key.name]) {
    exports[key.name](rl, 1);
  }
  return exports;
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
  };
};

/**
 * Clear `n` lines.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Number of lines to clear
 */

exports.clearLine = function(rl, n) {
  rl.output.write(exports.eraseLines(n));
  return exports;
};

/**
 * Clear `n` lines after the cursor.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Number of lines to clear
 * @api public
 */

exports.clearAfter = function (rl, n) {
  exports.clearLine(rl, n || 1);
  return exports;
},

/**
 * Clear the terminal.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Number of lines to clear
 * @api public
 */

exports.clearScreen = function(rl) {
  rl.write(null, {ctrl: true, name: 'l'});
  return exports;
};

/**
 * Get the last line from the given `str`
 *
 * @param {String} `str`
 * @return {String}
 * @api public
 */

exports.lastLine = function(str) {
  return utils.last(str.split('\n'));
};

/**
 * Get the height (rows) of the given `str`
 *
 * @param {String} `str`
 * @return {Number}
 * @api public
 */

exports.height = function(str) {
  return str.split('\n').length;
};

/**
 * Hide the cursor.
 *
 * @param {Readline} `rl` Readline interface
 * @return {Object} readline-utils object for chaining
 * @api public
 */

exports.hideCursor = function(rl) {
  rl.output.write("\x1B[?25l");
  return exports;
};

/**
 * Show the cursor.
 *
 * @param {Readline} `rl` Readline interface
 * @return {Object} readline-utils object for chaining
 * @api public
 */

exports.showCursor = function(rl) {
  rl.output.write("\x1B[?25h");
  return exports;
};

/**
 * Close the interface, remove event listeners, and restore/unmute prompt functionality
 *
 * @param {Readline} `rl` Readline interface
 * @return {Object} readline-utils object for chaining
 * @api public
 */

exports.close = function(rl, fn) {
  fn = fn || exports.forceClose.bind(exports, rl);
  process.removeListener('exit', fn);
  rl.removeListener('SIGINT', fn);
  if (typeof rl.output.unmute === 'function') {
    rl.output.unmute();
    rl.output.end();
  }
  rl.pause();
  rl.close();
  return exports;
};

/**
 * Close the interface when the keypress is `^C`
 *
 * @param {Readline} `rl` Readline interface
 * @return {Object} readline-utils object for chaining
 * @api public
 */

exports.forceClose = function(rl) {
  exports.close(rl);
  return exports;
};

/**
 * Normalize values from keypress events.
 *
 * @param {String} `str` Keypress source string emitted by the `keypress` event.
 * @param {Object} `key` Keypress `key` object emitted by the `keypress` event.
 * @return {Object} Normalized `event` object
 * @api public
 */

exports.normalize = function(str, key) {
  var event = utils.extend({}, { key: key || {}, value: str });
  var is = utils.isKey(event);
  if (!event.key.name || is('enter') || is('return')) return;
  if (is('up') || is('k') || (is('p') && event.key.ctrl)) {
    event.key.name = 'up';
  }
  if (is('down') || is('j') || (is('n') && event.key.ctrl)) {
    event.key.name = 'down';
  }
  if (utils.isNumber(event.value) && !/^\s+$/.test(String(event.value))) {
    event.value = Number(event.value);
    event.key.name = 'number';
  }
  return event;
};

/**
 * Erase `n` lines
 *
 * ```js
 * utils.eraseLines(3);
 * ```
 * @param {Number} `n`
 * @return {String} Returns the unicode to erase lines
 * @api public
 */

exports.eraseLines = function(n) {
  var num = utils.number(n);
  var lines = '';
  var i = -1;

  while (++i < num) {
    lines += '\u001b[1000D\u001b[K';
    if (i < num - 1) {
      lines += '\u001b[1A';
    }
  }
  return lines;
};

/**
 * Remove lines from the bottom of the terminal.
 * @param  {Number} `rl` Readline interface
 * @param  {Number} `lines` Number of lines to remove
 * @param  {Number} `height` Content height
 * @return {Object} Returns the readline-utils object for chaining
 */

exports.clearTrailingLines = function(rl, lines, height) {
  if (!utils.isNumber(lines)) lines = 0;
  var len = height + lines;

  while (len--) {
    readline.moveCursor(rl.output, -utils.cliWidth(rl), 0);
    readline.clearLine(rl.output, 0);
    if (len) readline.moveCursor(rl.output, 0, -1);
  }
  return exports;
};

/**
 * Remember the cursor position
 * @return {Prompt} Self
 */

exports.cursorPosition = function(rl) {
  return rl._getCursorPos();
};

/**
 * Restore the cursor position to where it has been previously stored.
 * @return {Prompt} Self
 */

exports.restoreCursorPos = function(rl, cursorPos) {
  if (!cursorPos) return;
  var line = rl._prompt + rl.line;
  readline.moveCursor(rl.output, -line.length, 0);
  readline.moveCursor(rl.output, cursorPos.cols, 0);
  cursorPos = null;
  return exports;
};

/**
 * Get the width of the terminal
 *
 * @param {Readline} `rl` Readline interface
 * @return {Number} Returns the number of columns.
 * @api public
 */

exports.cliWidth = function(rl) {
  var width = utils.cliWidth({defaultWidth: 80, output: rl.output});
  if (utils.isWindows()) {
    return width - 1;
  }
  return width;
};

/**
 * Break lines longer than the cli width so we can normalize the
 * natural line returns behavior accross terminals. (I don't see how
 * this can work consistently. It seems brittle and will probably be replaced
 * with https://github.com/jonschlinkert/word-wrap)
 *
 * @param {Array} `lines` Array of lines
 * @param {Number} `width` Terminal width
 * @api public
 */

exports.breakLines = function(lines, width) {
  var regex = new RegExp('(?:(?:\\033[[0-9;]*m)*.?){1,' + width + '}', 'g');
  return lines.map(function(line) {
    var matches = line.match(regex);
    if (!matches) return '';
    // last match is always empty
    matches.pop();
    return matches || '';
  });
};

/**
 * Joins the lines returned from [.breakLines](#breakLines).
 *
 * @param {Array|String} `lines` String or array of lines.
 * @param {Number} `width` Terminal width
 * @return {String}
 * @api public
 */

exports.forceLineReturn = function(lines, width) {
  if (typeof lines === 'string') {
    lines = exports.breakLines(lines.split('\n'), width);
  }
  return utils.flatten(lines).join('\n');
};

/**
 * Ensure the given `str` ends in a newline.
 *
 * ```js
 * console.log(utils.normalizeLF('foo'));
 * //=> 'foo\n'
 * ```
 * @param  {String} `str` The input string
 * @return {String}
 * @api public
 */

exports.normalizeLF = function(str) {
  return !/[\r\n]$/.test(str) ? (str + '\n') : str;
};
