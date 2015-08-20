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

[![Build Status](https://img.shields.io/travis/zswang/jfogs/master.svg)](https://travis-ci.org/zswang/jfogs)
[![NPM version](https://img.shields.io/npm/v/jfogs.svg)](http://badge.fury.io/js/jfogs)

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
    -x, --cross               Special character properties (default false)
    -v, --version             Output jfogs version
```

## License

MIT © [zswang](http://weibo.com/zswang)