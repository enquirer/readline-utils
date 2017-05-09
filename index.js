'use strict';

var EventEmitter = require('events').EventEmitter;
var isBuffer = require('is-buffer');
var readline = require('readline');
var flatten = require('arr-flatten');
var extend = require('extend-shallow');
var isWindows = require('is-windows');
var MuteStream = require('mute-stream');
var size = require('window-size');
var get = require('get-value');

/**
 * Create default options
 */

exports.createOptions = function(options) {
  var opts = extend({ terminal: true }, options);
  opts.output = opts.output || process.stdout;
  opts.input = opts.input || process.stdin;
  return opts;
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
  readline.moveCursor(rl.output, 0, -(n || 1));
  return this;
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
  return this;
};

/**
 * Move cursor left by `n` colums.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Characters to move left. Default is `1`.
 * @api public
 */

exports.left = function(rl, n) {
  readline.moveCursor(rl.output, -(n || 1));
  return this;
};

/**
 * Move cursor right by `n` colums.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Characters to move right. Default is `1`.
 * @api public
 */

exports.right = function(rl, n) {
  readline.moveCursor(rl.output, n || 1);
  return this;
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

exports.move = function(rl, key, n) {
  if (key && exports[key.name]) {
    exports[key.name](rl, n);
  }
  return this;
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
  return this;
};

/**
 * Clear `n` lines after the cursor.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Number of lines to clear
 * @api public
 */

exports.clearAfter = function(rl, n) {
  exports.clearLine(rl, n || 1);
  return this;
};

/**
 * Clear the terminal.
 *
 * @param {Readline} `rl` Readline interface
 * @param {Number} `n` Number of lines to clear
 * @api public
 */

exports.clearScreen = function(rl) {
  rl.write(null, { ctrl: true, name: 'l' });
  return this;
};

/**
 * Get the last line from the given `str`
 *
 * @param {String} `str`
 * @return {String}
 * @api public
 */

exports.lastLine = function(str) {
  return last(str.split('\n'));
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

exports.hideCursor = exports.cursorHide = function(rl) {
  rl.output.write('\x1B[?25l');
  return this;
};

/**
 * Show the cursor.
 *
 * @param {Readline} `rl` Readline interface
 * @return {Object} readline-utils object for chaining
 * @api public
 */

exports.showCursor = exports.cursorShow = function(rl) {
  rl.output.write('\x1B[?25h');
  return this;
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
  return this;
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
  return this;
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
  var event = extend({}, { key: key || {}, value: str });
  var is = isKey(event);

  if (typeof str === 'number') {
    str = String(str);
  }

  if (!event.key.name && str === '.') {
    event.key.name = 'period';
    return event;
  }

  // number
  if (str && str.length === 1) {
    if (/[0-9]/.test(str)) {
      event.key.name = 'number';
      return event;
    }
  }

  if (!event.key.name || is('enter') || is('return')) return;

  if (is('up') || (is('p') && event.key.ctrl)) {
    event.key.name = 'up';
    return event;
  }

  if (is('down') || (is('n') && event.key.ctrl)) {
    event.key.name = 'down';
    return event;
  }

  if (isNumber(event.value)) {
    event.value = Number(event.value);
    event.key.sequence = event.value;
    event.key.name = 'number';
    return event;
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
  var num = toNumber(n);
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
 * @api public
 */

exports.clearTrailingLines = function(rl, lines, height) {
  if (!isNumber(lines)) lines = 0;
  var len = height + lines;

  while (len--) {
    readline.moveCursor(rl.output, -exports.cliWidth(), 0);
    readline.clearLine(rl.output, 0);
    if (len) readline.moveCursor(rl.output, 0, -1);
  }
  return this;
};

/**
 * Remember the cursor position
 * @return {Object} readline-utils object
 * @api public
 */

exports.cursorPosition = function(rl) {
  return rl._getCursorPos();
};

/**
 * Restore the cursor position to where it has been previously stored.
 * @return {Object} readline-utils object
 * @api public
 */

exports.restoreCursorPos = function(rl, cursorPos) {
  if (!cursorPos) return;
  var line = rl._prompt + rl.line;
  readline.moveCursor(rl.output, -line.length, 0);
  readline.moveCursor(rl.output, cursorPos.cols, 0);
  cursorPos = null;
  return this;
};

/**
 * Get the width of the terminal
 *
 * @param {Readline} `rl` Readline interface
 * @return {Number} Returns the number of columns.
 * @api public
 */

exports.cliWidth = function() {
  if (isWindows()) {
    return size.width - 1;
  }
  return size.width;
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
  return flatten(lines).join('\n');
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
  return !/[\r\n]$/.test(str) ? str + '\n' : str;
};

/**
 * Returns a convenience function for checking the value of `event.key.name`
 */

function isKey(event) {
  return function(key) {
    return get(event, 'key.name') === key;
  };
}

/**
 * The following code is based on
 * https://github.com/TooTallNate/keypress
 * We had to make some changes to get keypress to
 * work for our needs
 */

// Regexes used for ansi escape code splitting
var metaKeyCodeRe = /^(?:\x1b)([a-zA-Z0-9])$/;
var functionKeyCodeRe = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;

/**
 * This module offers the internal "keypress" functionality from node-core's
 * `readline` module, for your own programs and modules to use.
 *
 * The `keypress` function accepts a readable Stream instance and makes it
 * emit "keypress" events.
 *
 * Usage:
 *
 * ``` js
 * require('keypress')(process.stdin);
 *
 * process.stdin.on('keypress', function(ch, key) {
 *   console.log(ch, key);
 *   if (key.ctrl && key.name === 'c') {
 *     process.stdin.pause();
 *   }
 * });
 * proces.stdin.resume();
 * ```
 *
 * @param {Stream} stream
 * @api public
 */

exports.keypress = function(stream) {
  if (isEmittingKeypress(stream)) return;

  var StringDecoder = require('string_decoder').StringDecoder; // lazy load
  stream._keypressDecoder = new StringDecoder('utf8');

  function onData(b) {
    if (listenerCount(stream, 'keypress') > 0) {
      var r = stream._keypressDecoder.write(b);
      if (r) exports.emitKey(stream, r);
    } else {
      // Nobody's watching anyway
      stream.removeListener('data', onData);
      stream.on('newListener', onNewListener);
    }
  }

  function onNewListener(event) {
    if (event === 'keypress') {
      stream.on('data', onData);
      stream.removeListener('newListener', onNewListener);
    }
  }

  if (listenerCount(stream, 'keypress') > 0) {
    stream.on('data', onData);
  } else {
    stream.on('newListener', onNewListener);
  }
};

/**
 * Returns `true` if the stream is already emitting "keypress" events.
 * `false` otherwise.
 *
 * @param {Stream} stream readable stream
 * @return {Boolean} `true` if the stream is emitting "keypress" events
 * @api private
 */

function isEmittingKeypress(stream) {
  var rtn = !!stream._keypressDecoder;
  if (!rtn) {
    // XXX: for older versions of node (v0.6.x, v0.8.x) we want to remove the
    // existing "data" and "newListener" keypress events since they won't include
    // this `keypress` module extensions (like "mousepress" events).
    stream.listeners('data').slice(0).forEach(function(l) {
      if (l.name === 'onData' && /exports.emitKey/.test(l.toString())) {
        stream.removeListener('data', l);
      }
    });
    stream.listeners('newListener').slice(0).forEach(function(l) {
      if (l.name === 'onNewListener' && /keypress/.test(l.toString())) {
        stream.removeListener('newListener', l);
      }
    });
  }
  return rtn;
}

/**
 * Enables "mousepress" events on the *input* stream. Note
 * that `stream` must be an *output* stream (i.e. a Writable
 * Stream instance), usually `process.stdout`.
 *
 * @param {Stream} stream writable stream instance
 * @api public
 */

exports.enableMouse = function(stream) {
  stream.write('\x1b[?1000h');
};

/**
 * Disables "mousepress" events from being sent to the *input*
 * stream. Note that `stream` must be an *output* stream (i.e.
 * a Writable Stream instance), usually `process.stdout`.
 *
 * @param {Stream} stream writable stream instance
 * @api public
 */

exports.disableMouse = function(stream) {
  stream.write('\x1b[?1000l');
};

/**
 * `EventEmitter.listenerCount()` polyfill, for backwards compat.
 *
 * @param {Emitter} emitter event emitter instance
 * @param {String} event event name
 * @return {Number} number of listeners for `event`
 * @api public
 */

var listenerCount = EventEmitter.listenerCount;
if (!listenerCount) {
  listenerCount = function(emitter, event) {
    return emitter.listeners(event).length;
  };
}

///////////////////////////////////////////////////////////////////////
// Below this function is code from node-core's `readline.js` module //
///////////////////////////////////////////////////////////////////////

/*
  Some patterns seen in terminal key escape codes, derived from combos seen
  at http://www.midnight-commander.org/browser/lib/tty/key.c

  ESC letter
  ESC [ letter
  ESC [ modifier letter
  ESC [ 1 ; modifier letter
  ESC [ num char
  ESC [ num ; modifier char
  ESC O letter
  ESC O modifier letter
  ESC O 1 ; modifier letter
  ESC N letter
  ESC [ [ num ; modifier char
  ESC [ [ 1 ; modifier letter
  ESC ESC [ num char
  ESC ESC O letter

  - char is usually ~ but $ and ^ also happen with rxvt
  - modifier is 1 +
                (shift     * 1) +
                (left_alt  * 2) +
                (ctrl      * 4) +
                (right_alt * 8)
  - two leading ESCs apparently mean the same as one leading ESC
*/

exports.emitKey = function(stream, s) {
  var parts;
  var ch;
  var key = {
    name: undefined,
    ctrl: false,
    meta: false,
    shift: false,
    value: s
  };

  if (isBuffer(s)) {
    if (s[0] > 127 && s[1] === undefined) {
      s[0] -= 128;
      s = '\x1b' + s.toString(stream.encoding || 'utf-8');
    } else {
      s = s.toString(stream.encoding || 'utf-8');
    }
  }

  if (typeof s === 'number') {
    s = String(s);
  }

  key.sequence = String(s);

  if (s === '\r') {
    // carriage return
    key.name = 'return';
  } else if (s === '\n') {
    // enter, should have been called linefeed
    key.name = 'enter';
  } else if (s === '\t') {
    // tab
    key.name = 'tab';
  } else if (s === '\b' || s === '\x7f' || s === '\x1b\x7f' || s === '\x1b\b') {
    // backspace or ctrl+h
    key.name = 'backspace';
    key.meta = s.charAt(0) === '\x1b';
  } else if (s === '\x1b' || s === '\x1b\x1b') {
    // escape key
    key.name = 'escape';
    key.meta = s.length === 2;
  } else if (s === ' ' || s === '\x1b ') {
    key.name = 'space';
    key.meta = s.length === 2;
  } else if (s <= '\x1a') {
    // ctrl+letter
    key.name = String.fromCharCode(s.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
    key.ctrl = true;
  } else if (s.length === 1 && s >= '0' && s <= '9') {
    // number
    key.name = 'number';
  } else if (s.length === 1 && '!"#$%&()*+:<>?@^_{|}~'.indexOf(s) !== -1) {
    // shift
    key.name = s;
    key.shift = true;
  } else if (',-\\/;=[]`'.indexOf(s) !== -1) {
    key.name = s;
  } else if (s.length === 1 && s >= 'a' && s <= 'z') {
    // lowercase letter
    key.name = s;
  } else if (s.length === 1 && s >= 'A' && s <= 'Z') {
    // shift+letter
    key.name = s.toLowerCase();
    key.shift = true;
  } else if ((parts = metaKeyCodeRe.exec(s))) {
    // meta+character key
    key.name = parts[1].toLowerCase();
    key.meta = true;
    key.shift = /^[A-Z]$/.test(parts[1]);
  } else if ((parts = functionKeyCodeRe.exec(s))) {
    // ansi escape sequence
    // reassemble the key code leaving out leading \x1b's,
    // the modifier key bitflag and any meaningless "1;" sequence
    var code = (parts[1] || '')
      + (parts[2] || '')
      + (parts[4] || '')
      + (parts[6] || '');

    var modifier = (parts[3] || parts[5] || 1) - 1;

    // Parse the key modifier
    key.ctrl = !!(modifier & 4);
    key.meta = !!(modifier & 10);
    key.shift = !!(modifier & 1);
    key.code = code;

    // Parse the key itself
    switch (code) {
      /* xterm/gnome ESC O letter */
      case 'OP':
        key.name = 'f1';
        break;
      case 'OQ':
        key.name = 'f2';
        break;
      case 'OR':
        key.name = 'f3';
        break;
      case 'OS':
        key.name = 'f4';
        break;
      /* xterm/rxvt ESC [ number ~ */
      case '[11~':
        key.name = 'f1';
        break;
      case '[12~':
        key.name = 'f2';
        break;
      case '[13~':
        key.name = 'f3';
        break;
      case '[14~':
        key.name = 'f4';
        break;
      /* from Cygwin and used in libuv */
      case '[[A':
        key.name = 'f1';
        break;
      case '[[B':
        key.name = 'f2';
        break;
      case '[[C':
        key.name = 'f3';
        break;
      case '[[D':
        key.name = 'f4';
        break;
      case '[[E':
        key.name = 'f5';
        break;
      /* common */
      case '[15~':
        key.name = 'f5';
        break;
      case '[17~':
        key.name = 'f6';
        break;
      case '[18~':
        key.name = 'f7';
        break;
      case '[19~':
        key.name = 'f8';
        break;
      case '[20~':
        key.name = 'f9';
        break;
      case '[21~':
        key.name = 'f10';
        break;
      case '[23~':
        key.name = 'f11';
        break;
      case '[24~':
        key.name = 'f12';
        break;
      /* xterm ESC [ letter */
      case '[A':
        key.name = 'up';
        break;
      case '[B':
        key.name = 'down';
        break;
      case '[C':
        key.name = 'right';
        break;
      case '[D':
        key.name = 'left';
        break;
      case '[E':
        key.name = 'clear';
        break;
      case '[F':
        key.name = 'end';
        break;
      case '[H':
        key.name = 'home';
        break;
      /* xterm/gnome ESC O letter */
      case 'OA':
        key.name = 'up';
        break;
      case 'OB':
        key.name = 'down';
        break;
      case 'OC':
        key.name = 'right';
        break;
      case 'OD':
        key.name = 'left';
        break;
      case 'OE':
        key.name = 'clear';
        break;
      case 'OF':
        key.name = 'end';
        break;
      case 'OH':
        key.name = 'home';
        break;
      /* xterm/rxvt ESC [ number ~ */
      case '[1~':
        key.name = 'home';
        break;
      case '[2~':
        key.name = 'insert';
        break;
      case '[3~':
        key.name = 'delete';
        break;
      case '[4~':
        key.name = 'end';
        break;
      case '[5~':
        key.name = 'pageup';
        break;
      case '[6~':
        key.name = 'pagedown';
        break;
      /* putty */
      case '[[5~':
        key.name = 'pageup';
        break;
      case '[[6~':
        key.name = 'pagedown';
        break;
      /* rxvt */
      case '[7~':
        key.name = 'home';
        break;
      case '[8~':
        key.name = 'end';
        break;
      /* rxvt keys with modifiers */
      case '[a':
        key.name = 'up';
        key.shift = true;
        break;
      case '[b':
        key.name = 'down';
        key.shift = true;
        break;
      case '[c':
        key.name = 'right';
        key.shift = true;
        break;
      case '[d':
        key.name = 'left';
        key.shift = true;
        break;
      case '[e':
        key.name = 'clear';
        key.shift = true;
        break;

      case '[2$':
        key.name = 'insert';
        key.shift = true;
        break;
      case '[3$':
        key.name = 'delete';
        key.shift = true;
        break;
      case '[5$':
        key.name = 'pageup';
        key.shift = true;
        break;
      case '[6$':
        key.name = 'pagedown';
        key.shift = true;
        break;
      case '[7$':
        key.name = 'home';
        key.shift = true;
        break;
      case '[8$':
        key.name = 'end';
        key.shift = true;
        break;

      case 'Oa':
        key.name = 'up';
        key.ctrl = true;
        break;
      case 'Ob':
        key.name = 'down';
        key.ctrl = true;
        break;
      case 'Oc':
        key.name = 'right';
        key.ctrl = true;
        break;
      case 'Od':
        key.name = 'left';
        key.ctrl = true;
        break;
      case 'Oe':
        key.name = 'clear';
        key.ctrl = true;
        break;

      case '[2^':
        key.name = 'insert';
        key.ctrl = true;
        break;
      case '[3^':
        key.name = 'delete';
        key.ctrl = true;
        break;
      case '[5^':
        key.name = 'pageup';
        key.ctrl = true;
        break;
      case '[6^':
        key.name = 'pagedown';
        key.ctrl = true;
        break;
      case '[7^':
        key.name = 'home';
        key.ctrl = true;
        break;
      case '[8^':
        key.name = 'end';
        key.ctrl = true;
        break;
      /* misc. */
      case '[Z':
        key.name = 'tab';
        key.shift = true;
        break;
      default:
        key.name = 'undefined';
        break;
    }
  } else if (s.length > 1 && s[0] !== '\x1b') {
    // Got a longer-than-one string of characters.
    // Probably a paste, since it wasn't a control sequence.
    for (var i = 0; i < s.length; i++) {
      exports.emitKey(stream, s[i]);
    }
    return;
  }

  // XXX: this "mouse" parsing code is NOT part of the node-core standard
  // `readline.js` module, and is a `keypress` module non-standard extension.
  if (key.code === '[M') {
    key.name = 'mouse';
    s = key.sequence;
    var b = s.charCodeAt(3);
    key.x = s.charCodeAt(4) - parseInt('040', 8);
    key.y = s.charCodeAt(5) - parseInt('040', 8);

    key.scroll = 0;

    key.ctrl = !!((1 << 4) & b);
    key.meta = !!((1 << 3) & b);
    key.shift = !!((1 << 2) & b);

    key.release = (3 & b) === 3;

    if ((1 << 6) & b) {
      // scroll
      key.scroll = 1 & b ? 1 : -1;
    }

    if (!key.release && !key.scroll) {
      key.button = b & 3;
    }
  }

  // Don't emit a key if no name was found
  if (key.name === undefined) {
    key = undefined;
  }

  if (s.length === 1) {
    ch = s;
  }

  if (key && key.name === 'mouse') {
    stream.emit('mousepress', key);
  } else if (key || ch) {
    stream.emit('keypress', ch, key);
  }
};

function last(arr) {
  return arr[arr.length - 1];
}

function isNumber(n) {
  return isNumber(n) && String(n).trim() !== '';
}

function toNumber(n) {
  return isNumber(n) ? Number(n) : 1;
}
