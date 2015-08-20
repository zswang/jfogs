# jfogs

Javascript code obfuscator

一个 JS 代码混淆器

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