'use strict';

var isNumber = require('is-number');

/**
 * Move cursor left by `n` colums.
 *
 * @param {Readline} `rl` Readline instance
 * @param {Number} `n` How far to go left (default to 1)
 */

exports.left = function(rl, n) {
  rl.output.write(move('left', n));
};

/**
 * Move cursor right by `n` colums.
 *
 * @param {Readline} `rl` Readline instance
 * @param {Number} `n` How far to go left (default to 1)
 */

exports.right = function(rl, n) {
  rl.output.write(move('right', n));
};

/**
 * Move cursor up by `n` lines.
 *
 * @param {Readline} `rl` Readline instance
 * @param {Number} `n` How far to go up (default to 1)
 */

exports.up = function(rl, n) {
  rl.output.write(move('up', n));
};

/**
 * Move cursor down by `n` lines.
 *
 * @param {Readline} `rl` Readline instance
 * @param {Number} `n` How far to go down (default to 1)
 */

exports.down = function(rl, n) {
  rl.output.write(move('down', n));
};

/**
 * Clear `n` lines.
 *
 * @param {Readline} `rl` Readline instance
 * @param {Number} `n` Number of lines to clear
 */

exports.clearLine = function(rl, n) {
  rl.output.write(eraseLines(n));
};

/**
 * Utils
 */

function number(n) {
  return isNumber(n) ? n : 1;
}

function move(ch, n) {
  var cursor = {right: 'C', left: 'D', up: 'A', down: 'B'};
  return `\u001b[${number(n)}${cursor[ch]}`;
}

function eraseLines(n) {
  var num = number(n);
  var lines = '';
  var i = -1;

  while (++i < num) {
    lines += '\u001b[1000D\u001b[K';
    if (i < num - 1) {
      lines += '\u001b[1A';
    }
  }
  return lines;
}
