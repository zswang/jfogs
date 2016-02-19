#!/usr/bin/env node

'use strict';
var jfogs = require('./');
var optimist = require('optimist');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var util = require('util');
var colors = require('colors');

var argv = optimist
  .usage('$0 input1.js [input2.js] -o output')

.alias('h', 'help')
  .describe('h', 'show this help message and exit.')
  .string('h')

.alias('o', 'output')
  .describe('o', 'output file.')
  .string('o')

.alias('t', 'type')
  .describe('t', 'Encryption type. (e.g. "zero" | "reverse")')
  .string('t')

.alias('b', 'breakout')
  .describe('t', 'Export Variants & Function')
  .boolean('b')

.alias('v', 'version')
  .describe('v', 'Print version number and exit.')

.wrap(80)
  .argv;

if (argv._.length < 1) {
  if (argv.version) {
    var json = require('./package.json');
    console.log(json.name + ' ' + json.version);
    return;
  }

  console.log(
    String(function () {
      /*
Usage:

    #{j,yellow}#{fog,green}#{s,yellow} <input list> [options]

Options:

    #{-o, --output,cyan}              Output file (default STDOUT)
    #{-t, --type,cyan}                Encryption type (default "") e.g. "zero" | "reverse"
    #{-v, --version,cyan}             Output jfogs version
    #{-b, --breakout,cyan}            Export Variants & Function
      */
    })
    .replace(/[^]*\/\*!?\s*|\s*\*\/[^]*/g, '')
    .replace(/#\{(.*?),(\w+)\}/g, function (all, text, color) {
      return colors[color](text);
    })
  );
  return;
}

var contents = [];
var filenames = [];
argv._.forEach(function (filename) {
  filenames.push(filename);
  contents.push(jfogs.obfuscate(fs.readFileSync(filename), argv));
});
var content = contents.join('\n');
if (argv.output) {
  mkdirp(path.dirname(argv.output));
  fs.writeFileSync(argv.output, content);
  console.log(colors.green(util.format('%j jfogs output complete.', filenames)));
}
else {
  console.log(content);
}