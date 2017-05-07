# readline-utils [![NPM version](https://img.shields.io/npm/v/readline-utils.svg?style=flat)](https://www.npmjs.com/package/readline-utils) [![NPM monthly downloads](https://img.shields.io/npm/dm/readline-utils.svg?style=flat)](https://npmjs.org/package/readline-utils) [![NPM total downloads](https://img.shields.io/npm/dt/readline-utils.svg?style=flat)](https://npmjs.org/package/readline-utils) [![Linux Build Status](https://img.shields.io/travis/enquirer/readline-utils.svg?style=flat&label=Travis)](https://travis-ci.org/enquirer/readline-utils) [![Windows Build Status](https://img.shields.io/appveyor/ci/enquirer/readline-utils.svg?style=flat&label=AppVeyor)](https://ci.appveyor.com/project/enquirer/readline-utils)

> Readline utils, for moving the cursor, clearing lines, creating a readline interface, and more.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save readline-utils
```

## Usage

```js
var utils = require('readline-utils');
```

## API

### [.createInterface](index.js#L25)

Create a readline interface with the given `options`.

**Params**

* `options` **{Object}**

### [.up](index.js#L42)

Move cursor up by `n` lines.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Lines up to move. Default is `1`.

### [.down](index.js#L55)

Move cursor down by `n` lines.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Lines down to move. Default is `1`.

### [.left](index.js#L68)

Move cursor left by `n` colums.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Characters to move left. Default is `1`.

### [.right](index.js#L81)

Move cursor right by `n` colums.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Characters to move right. Default is `1`.

### [.move](index.js#L100)

Move cursor up, down, left or right by `1` line.

**Params**

* `rl` **{Readline}**: Readline interface

**Example**

```js
var utils = require('readline-utils');
var rl = utils.createInterface();
rl.input.on('keypress', function(str, key) {
  utils.move(rl, key);
});
```

### [.auto](index.js#L120)

Callback function for the `keypress` event, to automatically move cursor up, down, left or right by `1` line.

**Params**

* `rl` **{Readline}**: Readline interface

**Example**

```js
var utils = require('readline-utils');
var rl = utils.createInterface();
rl.input.on('keypress', utils.auto(rl));
```

### [.clearAfter](index.js#L146)

Clear `n` lines after the cursor.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Number of lines to clear

### [.clearScreen](index.js#L159)

Clear the terminal.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Number of lines to clear

### [.lastLine](index.js#L172)

Get the last line from the given `str`

**Params**

* `str` **{String}**
* `returns` **{String}**

### [.height](index.js#L184)

Get the height (rows) of the given `str`

**Params**

* `str` **{String}**
* `returns` **{Number}**

### [.hideCursor](index.js#L196)

Hide the cursor.

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.showCursor](index.js#L209)

Show the cursor.

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.close](index.js#L222)

Close the interface, remove event listeners, and restore/unmute prompt functionality

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.forceClose](index.js#L243)

Close the interface when the keypress is `^C`

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.normalize](index.js#L257)

Normalize values from keypress events.

**Params**

* `str` **{String}**: Keypress source string emitted by the `keypress` event.
* `key` **{Object}**: Keypress `key` object emitted by the `keypress` event.
* `returns` **{Object}**: Normalized `event` object

### [.eraseLines](index.js#L310)

Erase `n` lines

**Params**

* `n` **{Number}**
* `returns` **{String}**: Returns the unicode to erase lines

**Example**

```js
utils.eraseLines(3);
```

### [.clearTrailingLines](index.js#L333)

Remove lines from the bottom of the terminal.

**Params**

* `rl` **{Number}**: Readline interface
* `lines` **{Number}**: Number of lines to remove
* `height` **{Number}**: Content height
* `returns` **{Object}**: Returns the readline-utils object for chaining

### [.cursorPosition](index.js#L351)

Remember the cursor position

* `returns` **{Object}**: readline-utils object

### [.restoreCursorPos](index.js#L361)

Restore the cursor position to where it has been previously stored.

* `returns` **{Object}**: readline-utils object

### [.cliWidth](index.js#L378)

Get the width of the terminal

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Number}**: Returns the number of columns.

### [.breakLines](index.js#L397)

Break lines longer than the cli width so we can normalize the
natural line returns behavior accross terminals. (I don't see how
this can work consistently. It seems brittle and will probably be replaced
with https://github.com/jonschlinkert/word-wrap)

**Params**

* `lines` **{Array}**: Array of lines
* `width` **{Number}**: Terminal width

### [.forceLineReturn](index.js#L417)

Joins the lines returned from [.breakLines](#breakLines).

**Params**

* `lines` **{Array|String}**: String or array of lines.
* `width` **{Number}**: Terminal width
* `returns` **{String}**

### [.normalizeLF](index.js#L436)

Ensure the given `str` ends in a newline.

**Params**

* `str` **{String}**: The input string
* `returns` **{String}**

**Example**

```js
console.log(utils.normalizeLF('foo'));
//=> 'foo\n'
```

### [.keypress](index.js#L486)

This module offers the internal "keypress" functionality from node-core's `readline` module, for your own programs and modules to use.

The `keypress` function accepts a readable Stream instance and makes it
emit "keypress" events.
Usage:

**Params**

* **{Stream}**: stream

**Example**

``` js
require('keypress')(process.stdin);

process.stdin.on('keypress', function(ch, key) {
  console.log(ch, key);
  if (key.ctrl && key.name === 'c') {
    process.stdin.pause();
  }
});
proces.stdin.resume();
```

### [.enableMouse](index.js#L555)

Enables "mousepress" events on the _input_ stream. Note
that `stream` must be an _output_ stream (i.e. a Writable
Stream instance), usually `process.stdout`.

**Params**

* **{Stream}**: stream writable stream instance

### [.disableMouse](index.js#L568)

Disables "mousepress" events from being sent to the _input_

stream. Note that `stream` must be an _output_ stream (i.e.
a Writable Stream instance), usually `process.stdout`.

**Params**

* **{Stream}**: stream writable stream instance

### [listenerCount](index.js#L581)

`EventEmitter.listenerCount()` polyfill, for backwards compat.

**Params**

* **{Emitter}**: emitter event emitter instance
* **{String}**: event event name
* `returns` **{Number}**: number of listeners for `event`

## Attribution

Some of this code was borrowed from [Inquirer][].

## About

### Related projects

* [choices-separator](https://www.npmjs.com/package/choices-separator): Separator for choices arrays in prompts. Based on the Separator from inquirer. | [homepage](https://github.com/enquirer/choices-separator "Separator for choices arrays in prompts. Based on the Separator from inquirer.")
* [enquirer](https://www.npmjs.com/package/enquirer): Intuitive, plugin-based prompt system for node.js. Much faster and lighter alternative to Inquirer, with all… [more](https://github.com/enquirer/enquirer) | [homepage](https://github.com/enquirer/enquirer "Intuitive, plugin-based prompt system for node.js. Much faster and lighter alternative to Inquirer, with all the same prompt types and more, but without the bloat.")
* [prompt-choices](https://www.npmjs.com/package/prompt-choices): Create an array of multiple choice objects for use in prompts. | [homepage](https://github.com/enquirer/prompt-choices "Create an array of multiple choice objects for use in prompts.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

### Contributors

| **Commits** | **Contributor** | 
| --- | --- |
| 20 | [jonschlinkert](https://github.com/jonschlinkert) |
| 7 | [doowb](https://github.com/doowb) |

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](https://twitter.com/jonschlinkert)

### License

Copyright © 2017, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on May 07, 2017._