var jfogs = require('../.');
var assert = require('should');
var fs = require('fs');
var util = require('util');
var path = require('path');

/**
 * 清除 \r，为兼容 Windows 下的文本换行符 CRLF
 */
function cleanCRLF(text) {
  return String(text).replace(/\r\n?/g, '\n');
}

// coverage
jfogs.obfuscate('');
jfogs.obfuscate('function test() {}');
jfogs.obfuscate('function test(a) { a.囧 = 1; }', {
  type: 'zero'
});

describe('fixtures', function () {
  var dirname = 'test/fixtures';
  var items = fs.readdirSync(dirname).filter(function (item) {
    return /\.input\.(\w+)$/.test(item);
  }).forEach(function (input) {
    input = path.join(dirname, input);
    if (/\.throw\./.test(input)) {
      it(input, function () {
        (function () {
          jfogs.obfuscate(fs.readFileSync(input));
        }).should.throw();
      });
      return;
    }

    var output = input.replace(/\.input\.(\w+)$/, '.output.$1');
    var reverseOutput = input.replace(/\.input\.(\w+)$/, '.reverse.output.$1');
    var zeroOutput = input.replace(/\.input\.(\w+)$/, '.zero.output.$1');

    // var options = {};
    // if (input.indexOf('zero') >= 0) {
    //   options.type = 'zero';
    // }
    // if (input.indexOf('reverse') >= 0) {
    //   options.type = 'reverse';
    // }
    if (fs.existsSync(output)) {
      it(input, function () {
        assert.equal(
          jfogs.obfuscate(fs.readFileSync(input), {}),
          cleanCRLF(fs.readFileSync(output))
        );
      });
    }

    if (fs.existsSync(reverseOutput)) {
      it(input + ' -t reverse', function () {
        assert.equal(
          jfogs.obfuscate(fs.readFileSync(input), {
            type: 'reverse'
          }),
          cleanCRLF(fs.readFileSync(reverseOutput))
        );
      });
    }

    if (fs.existsSync(zeroOutput)) {
      it(input + ' -t zero', function () {
        assert.equal(
          jfogs.obfuscate(fs.readFileSync(input), {
            type: 'zero'
          }),
          cleanCRLF(fs.readFileSync(zeroOutput))
        );
      });
    }
  });
});