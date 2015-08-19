/*<remove>*/
'use strict';
/*</remove>*/

/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

var esprima = require('esprima');
var util = require('util');

/**
 * 对字符串进行 Unicode 编码
 *
 * @param {string} str 源字符串
 * @return {string} 返回编码后的内容
 */
function encodeUnicode(str) {
  return String(str).replace(/[^\x09-\x7f\ufeff]/g, function (all) {
    return '\\u' + (0x10000 + all.charCodeAt()).toString(16).substring(1);
  });
}

var crossChars = [];
for (var i = 0; i < 36; i++) {
  crossChars.push(String.fromCharCode(0x0620 + i) + String.fromCharCode(0x0300 + i));
}

function crossCode(index) {
  return index.toString(36).replace(/./g, function (all) {
    return crossChars[parseInt(all, 36)];
  });
}

/**
 * 混淆 JS 代码
 *
 * @param {String} code JS 代码字符串
 * @param {Object} options 配置项
 * @param {Object} options.type 混淆类型 'zero': 零宽字符, 'reverse': 颠掉字符
 * @return {String} 返回混淆后的代码
 */
function obfuscate(code, options) {
  if (!code) {
    return code;
  }
  options = options || {};

  code = String(code).replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
    .replace(/^\uFEFF/, ''); // 数据清洗
  var syntax = esprima.parse(code, {
    range: true,
    loc: false
  });

  var memberExpressions = [];
  var propertys = {};
  var names = [];
  var expressions = [];
  var guid = 0;

  function scan(obj) {
    if (!obj) {
      return;
    }
    if (obj.type === 'MemberExpression') {
      if (obj.property.type === 'Literal' ||
        (obj.property.type === 'Identifier' && !obj.computed)) {
        memberExpressions.push(obj);
        var name = JSON.stringify(obj.property.type === 'Literal' ?
          obj.property.raw : obj.property.name);
        if (!propertys[name]) {
          propertys[name] = '$jfogs$' + (guid++);
          names.push(propertys[name]);
          expressions.push(name);
        }
      }
    }
    for (var key in obj) {
      if (typeof obj[key] === 'object') {
        scan(obj[key]);
      }
    }
  }
  scan(syntax);
  memberExpressions.sort(function (a, b) {
    return b.property.range[0] - a.property.range[1];
  });

  if (options.cross) {
    expressions.forEach(function (expression, index) {
      propertys[expression] = '$jfogs$prop.' + crossCode(index);
    });
  }

  memberExpressions.forEach(function (obj) {
    var name = JSON.stringify(obj.property.type === 'Literal' ?
      obj.property.raw : obj.property.name);
    if (obj.property.type === 'Literal') {
      code = code.slice(0, obj.property.range[0]) + propertys[name] +
        code.slice(obj.property.range[1]);
    }
    else {
      code = code.slice(0, obj.object.range[1]) +
        '[' + propertys[name] + ']' +
        code.slice(obj.property.range[1]);
    }
  });

  var decryption = '';

  switch (options.type) {
  case 'zero':
    expressions = expressions.map(function (item) {
      var t = parseInt('10000000', 2);
      return '"' + encodeUnicode(JSON.parse(item)).replace(/[^]/g, function (all) {
        return (t + all.charCodeAt()).toString(2).substring(1).replace(/[^]/g, function (n) {
          return {
            0: '\u200c',
            1: '\u200d'
          }[n];
        });
      }) + '"';
    });
    decryption = '' +
      'var $jfogs$argv = arguments;\n' +
      'for (var $jfogs$i = 0; $jfogs$i < $jfogs$argv.length; $jfogs$i++) {\n' +
      '  $jfogs$argv[$jfogs$i] = $jfogs$argv[$jfogs$i].replace(/./g,\n' +
      '    function (a) {\n' +
      '      return {\n' +
      '        "\u200c": 0,\n' +
      '        "\u200d": 1\n' +
      '      }[a]\n' +
      '    }\n' +
      '  ).replace(/.{7}/g, function (a) {\n' +
      '    return String.fromCharCode(parseInt(a, 2));\n' +
      '  });\n' +
      '}\n';
    break;
  case 'reverse':
    expressions = expressions.map(function (item) {
      return item.split('').reverse().join('');
    });
    decryption = '' +
      'var $jfogs$argv = arguments;\n' +
      'for (var $jfogs$i = 0; $jfogs$i < $jfogs$argv.length; $jfogs$i++) {\n' +
      '  $jfogs$argv[$jfogs$i] = $jfogs$argv[$jfogs$i].split("").reverse().join("");\n' +
      '}\n';
    break;
  }

  if (options.cross) {
    decryption += 'var $jfogs$prop = {};\n';
    expressions.forEach(function (expression, index) {
      decryption += util.format('$jfogs$prop.%s = %s;\n', crossCode(index), names[index]);
    });
  }

  return util.format('(function (%s) {\n%s\n%s\n})(%s);',
    names.join(', '),
    decryption,
    code,
    expressions.join(', ')
  );
}
exports.obfuscate = obfuscate;