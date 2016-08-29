# readline-utils [![NPM version](https://img.shields.io/npm/v/readline-utils.svg?style=flat)](https://www.npmjs.com/package/readline-utils) [![NPM downloads](https://img.shields.io/npm/dm/readline-utils.svg?style=flat)](https://npmjs.org/package/readline-utils) [![Build Status](https://img.shields.io/travis/enquirer/readline-utils.svg?style=flat)](https://travis-ci.org/enquirer/readline-utils)

Readline utils, for moving the cursor, clearing lines, creating a readline interface, and more.

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

### [.createInterface](index.js#L26)

Create a readline interface with the given `options`.

**Params**

* `options` **{Object}**

### [.up](index.js#L48)

Move cursor up by `n` lines.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Lines up to move. Default is `1`.

### [.down](index.js#L61)

Move cursor down by `n` lines.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Lines down to move. Default is `1`.

### [.left](index.js#L74)

Move cursor left by `n` colums.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Characters to move left. Default is `1`.

### [.right](index.js#L87)

Move cursor right by `n` colums.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Characters to move right. Default is `1`.

### [.move](index.js#L106)

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

### [.auto](index.js#L126)

Callback function for the `keypress` event, to automatically move cursor up, down, left or right by `1` line.

**Params**

* `rl` **{Readline}**: Readline interface

**Example**

```js
var utils = require('readline-utils');
var rl = utils.createInterface();
rl.input.on('keypress', utils.auto(rl));
```

### [.clearAfter](index.js#L152)

Clear `n` lines after the cursor.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Number of lines to clear

### [.clearScreen](index.js#L165)

Clear the terminal.

**Params**

* `rl` **{Readline}**: Readline interface
* `n` **{Number}**: Number of lines to clear

### [.lastLine](index.js#L178)

Get the last line from the given `str`

**Params**

* `str` **{String}**
* `returns` **{String}**

### [.height](index.js#L190)

Get the height (rows) of the given `str`

**Params**

* `str` **{String}**
* `returns` **{Number}**

### [.hideCursor](index.js#L202)

Hide the cursor.

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.showCursor](index.js#L215)

Show the cursor.

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.close](index.js#L228)

Close the interface, remove event listeners, and restore/unmute prompt functionality

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.forceClose](index.js#L249)

Close the interface when the keypress is `^C`

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Object}**: readline-utils object for chaining

### [.normalize](index.js#L263)

Normalize values from keypress events.

**Params**

* `str` **{String}**: Keypress source string emitted by the `keypress` event.
* `key` **{Object}**: Keypress `key` object emitted by the `keypress` event.
* `returns` **{Object}**: Normalized `event` object

### [.eraseLines](index.js#L291)

Erase `n` lines

**Params**

* `n` **{Number}**
* `returns` **{String}**: Returns the unicode to erase lines

**Example**

```js
utils.eraseLines(3);
```

### [.cliWidth](index.js#L356)

Get the width of the terminal

**Params**

* `rl` **{Readline}**: Readline interface
* `returns` **{Number}**: Returns the number of columns.

### [.breakLines](index.js#L375)

Break lines longer than the cli width so we can normalize the
natural line returns behavior accross terminals. (I don't see how
this can work consistently. It seems brittle and will probably be replaced
with https://github.com/jonschlinkert/word-wrap)

**Params**

* `lines` **{Array}**: Array of lines
* `width` **{Number}**: Terminal width

### [.forceLineReturn](index.js#L395)

Joins the lines returned from [.breakLines](#breakLines).

**Params**

* `lines` **{Array|String}**: String or array of lines.
* `width` **{Number}**: Terminal width
* `returns` **{String}**

### [.normalizeLF](index.js#L414)

Ensure the given `str` ends in a newline.

**Params**

* `str` **{String}**: The input string
* `returns` **{String}**

**Example**

```js
console.log(utils.normalizeLF('foo'));
//=> 'foo\n'
```

## Attribution

Some of this code was borrowed from [Inquirer](https://github.com/sboudrias/Inquirer.js).

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](contributing.md) for avice on opening issues, pull requests, and coding standards.

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/enquirer/readline-utils/blob/master/LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.1.30, on August 28, 2016._