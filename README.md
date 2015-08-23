# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

# jfogs

Javascript code obfuscator

一个 JS 代码混淆器

e.g.

+ input:

```js
console.log(/\w/img.test('hello'));
```

+ output:

```js
(function ($fog$0, $fog$1, $fog$2, $fog$3) {
  console[$fog$0]($fog$2[$fog$1]($fog$3));
})("log", "test", /\w/img, "hello");
```

## Install

```sh
$ npm install --save jfogs
```

## Usage

```js
var jfogs = require('jfogs');

console.log(jfogs.obfuscate('function hello() { console.log('Hello world!'); }'));
```

```sh
$ npm install --global jfogs
$ jfogs --help
```

## Command Line

```bash
Usage:

    jfogs <input list> [options]

Options:

    -o, --output              Output file (default STDOUT)
    -t, --type                Encryption type (default "") e.g. "zero" | "reverse"
    -v, --version             Output jfogs version
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/jfogs
[npm-image]: https://badge.fury.io/js/jfogs.svg
[travis-url]: https://travis-ci.org/zswang/jfogs
[travis-image]: https://travis-ci.org/zswang/jfogs.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/jfogs?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/jfogs/badge.svg?branch=master&service=github
