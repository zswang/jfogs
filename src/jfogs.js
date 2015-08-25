/*<remove>*/
/*jslint node: true */
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

/**
 * 格式化函数
 *
 * @param {String} template 模板
 * @param {Object} json 数据项
 */
function format(template, json) {
  /*<remove>*/
  if (typeof template === 'function') { // 函数多行注释处理
    template = String(template).replace(
      /^[^]*\/\*\!?|\*\/[^]*$/g, // 替换掉函数前后部分
      ''
    );
  }
  /*</remove>*/
  return template.replace(/#\{(.*?)\}/g, function (all, key) {
    return json[key];
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
  var prefix = options.prefix || '$fog$';

  function identFrom(index) {
    return prefix + index;
  }

  code = String(code).replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
    .replace(/^\uFEFF/, ''); // 数据清洗
  var syntax = esprima.parse(code, {
    range: true,
    loc: false
  });

  var guid = 0;
  var memberExpressions = [];
  var propertys = {};
  var names = [];
  var expressions = [];
  var ranges = {};

  function record(obj, name) {
    var range;
    if (obj.type === 'Literal') {
      range = obj.range;
    }
    else {
      range = obj.property.range;
    }
    if (ranges[range]) {
      return;
    }
    ranges[range] = true;
    obj.$name = name;
    memberExpressions.push(obj);
    if (!propertys[name]) {
      propertys[name] = identFrom(guid++);
      names.push(propertys[name]);
      expressions.push(name);
    }
  }

  function scan(obj, parentKey) {
    if (!obj) {
      return;
    }
    if (parentKey === 'range') {
      return;
    }
    if (obj.type === 'MemberExpression') {
      if (obj.property.type === 'Identifier' && !obj.computed) {
        record(obj, JSON.stringify(obj.property.name));
      }
    }
    if (obj.type === 'Literal') {
      if (parentKey === 'expression') {
        return;
      }

      if (/^["']/.test(obj.raw)) {
        if (parentKey !== 'key') { // 不能是 JSON 的 key
          /* jslint evil: true */
          record(obj, JSON.stringify(eval(obj.raw)));
        }
      }
      else {
        record(obj, obj.raw);
      }
      return;
    }
    for (var key in obj) {
      if (typeof obj[key] === 'object') {
        scan(obj[key], key);
      }
    }
  }
  scan(syntax);

  switch (options.type) {
  case 'reverse':
    var items = expressions.slice().reverse();
    items.forEach(function (item, index) {
      propertys[item] = names[index];
    });
    break;
  }

  /*<debug> //
  console.log(JSON.stringify(syntax, null, '  '));
  //</debug>*/
  memberExpressions.sort(function (a, b) {
    if (a.type === 'Literal') {
      a = a.range[1];
    }
    else {
      a = a.property.range[1];
    }
    if (b.type === 'Literal') {
      b = b.range[1];
    }
    else {
      b = b.property.range[1];
    }
    return b - a;
  }).forEach(function (obj) {
    if (obj.type === 'Literal') {
      code = code.slice(0, obj.range[0]) + propertys[obj.$name] +
        code.slice(obj.range[1]);
    }
    else { // if (obj.type === 'MemberExpression') {
      code = code.slice(0, obj.property.range[0]).replace(/\.\s*$/, '') +
        '[' + propertys[obj.$name] + ']' +
        code.slice(obj.property.range[1]);
    }
  });

  var decryption = '';
  var hasString; // 是否存在字符串处理

  /*<jdists encoding="candy">*/
  switch (options.type) {
  case 'zero':
    expressions = expressions.map(function (item) {
      if (!(/^["]/.test(item)) || item.length <= 2) {
        return item;
      }
      hasString = true;
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
    if (hasString) {
      var params = {
        argv: identFrom(guid++),
        index: identFrom(guid++),
        empty: identFrom(guid++),
        len: identFrom(guid++),
        string: identFrom(guid++),
        replace: identFrom(guid++),
        fromCharCode: identFrom(guid++),
        length: identFrom(guid++),
        0: identFrom(guid++),
        1: identFrom(guid++),
        2: identFrom(guid++),
        String: identFrom(guid++),
        regex1: identFrom(guid++),
        regex2: identFrom(guid++),
        fromCharCode: identFrom(guid++),
        parseInt: identFrom(guid++),
        rightToLeft: identFrom(guid++)
      };

      names.push(params.rightToLeft);
      expressions.push('"\u202e"'); // 干扰字符

      names.push(params.len);
      expressions.push(expressions.length - 1);

      names.push(params.string);
      expressions.push('"string"');

      names.push(params.replace);
      expressions.push('"replace"');

      names.push(params.regex1);
      expressions.push('/./g');

      names.push(params.regex2);
      expressions.push('/.{7}/g');

      names.push(params.String);
      expressions.push('String');

      names.push(params.fromCharCode);
      expressions.push('"fromCharCode"');

      names.push(params[0]);
      expressions.push(0);

      names.push(params[1]);
      expressions.push(1);

      names.push(params[2]);
      expressions.push(2);

      names.push(params.parseInt);
      expressions.push('parseInt');

      decryption = format( /*#*/ function () {
        /*!
if ('\u202e' !== #{rightToLeft}) {
  return;
}
var #{argv} = arguments;
for (var #{index} = 0; #{index} < #{len}; #{index}++) {
  if (typeof #{argv}[#{index}] !== #{string}) {
    continue;
  }
  #{argv}[#{index}] = #{argv}[#{index}][#{replace}](#{regex1},
    function (a) {
      return {
        '\u200c': #{0},
        '\u200d': #{1}
      }[a];
    }
  ).replace(#{regex2}, function (a) {
    return #{String}[#{fromCharCode}](#{parseInt}(a, #{2}));
  });
}
    */
      }, params);
    }
    break;
  case 'reverse':
    expressions = expressions.map(function (item) {
      if (/^"/.test(item)) {
        hasString = true;
        return JSON.stringify(JSON.parse(item).split('').reverse().join(''));
      }
      return item;
    });
    var params = {
      argv: identFrom(guid++),
      index: identFrom(guid++),
      empty: identFrom(guid++),
      len: identFrom(guid++),
      temp: identFrom(guid++),
      string: identFrom(guid++),
      split: identFrom(guid++),
      reverse: identFrom(guid++),
      0: identFrom(guid++),
      1: identFrom(guid++),
      2: identFrom(guid++),
      join: identFrom(guid++),
      rightToLeft: identFrom(guid++)
    };

    names.push(params.rightToLeft);
    expressions.push('"\u202e"'); // 干扰字符

    names.push(params.len);
    expressions.push(expressions.length - 1);

    if (hasString || expressions.length > 1) {

      decryption += format( /*#*/ function () {
        /*!
if ('\u202e' !== #{rightToLeft}) {
  return;
}
var #{argv} = arguments;
var #{index};
        */
      }, params);

      names.push(params.empty);
      expressions.push('""');

      names.push(params[0]);
      expressions.push('0');
    }
    if (hasString) {

      names.push(params.string);
      expressions.push('"string"');

      names.push(params.split);
      expressions.push('"split"');

      names.push(params.reverse);
      expressions.push('"reverse"');

      names.push(params.join);
      expressions.push('"join"');

      decryption += format( /*#*/ function () {
        /*!
for (#{index} = #{0}; #{index} < #{len}; #{index}++) {
  if (typeof #{argv}[#{index}] === #{string}) {
    #{argv}[#{index}] = #{argv}[#{index}][#{split}](#{empty})[#{reverse}]()[#{join}](#{empty});
  }
}
        */
      }, params);
    }

    if (expressions.length > 1) {
      names.push(params[1]);
      expressions.push('1');

      names.push(params[2]);
      expressions.push('2');

      decryption += format( /*#*/ function () {
        /*!
for (#{index} = #{0}; #{index} < #{len} / #{2}; #{index}++) {
  var #{temp} = #{argv}[#{index}];
  #{argv}[#{index}] = #{argv}[#{len} - #{index} - #{1}];
  #{argv}[#{len} - #{index} - #{1}] = #{temp};
}
        */
      }, params);
    }
    break;
  default:
    var params = {
      rightToLeft: identFrom(guid++)
    };
    names.unshift(params.rightToLeft);
    expressions.unshift('"\u202e"'); // 干扰字符
    decryption += format( /*#*/ function () {
      /*!
if ('\u202e' !== #{rightToLeft}) {
  return;
}
        */
    }, params);
    break;
  }
  return format( /*#*/ function () {
    /*!
(function (#{names}) {
  #{decryption}
  #{code}
})(#{expressions});
     */
  }, {
    names: names.join(', '),
    decryption: decryption,
    code: code,
    expressions: expressions.join(', ')
  });
  /*</jdists>*/
}

exports.obfuscate = obfuscate;