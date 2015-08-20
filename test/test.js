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

describe('fixtures', function() {
  var dirname = 'test/fixtures';
  var items = fs.readdirSync(dirname).filter(function(item) {
    return /\.input\.(\w+)$/.test(item);
  }).forEach(function(input) {
    var output = input.replace(/\.input\.(\w+)$/, '.output.$1');
    it(input, function() {
      if (/\.throw\./.test(input)) { // 出现异常
        (function() {
          jfogs.obfuscate(fs.readFileSync(path.join(dirname, input)));
        }).should.throw();
        return;
      }
      var options = {};
      if (input.indexOf('zero') >= 0) {
        options.type = 'zero';
      }
      if (input.indexOf('reverse') >= 0) {
        options.type = 'reverse';
      }
      assert.equal(
        jfogs.obfuscate(fs.readFileSync(path.join(dirname, input)), options),
        cleanCRLF(fs.readFileSync(path.join(dirname, output)))
      );
    });
  });

});