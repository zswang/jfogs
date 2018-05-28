(function(exportName) {

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

  /*<remove>*/
  /*jslint node: true */
  'use strict';
  /*</remove>*/

  var esprimaInstance;
  if (typeof require === 'function') { // in node
    esprimaInstance = require('esprima');
  } else if (window.esprima) { // in browser
    esprimaInstance = window.esprima;
  } else {
    throw '"esprima" is undefined.';
  }

  var exports = {};

  /*<jdists encoding="fndep" depend="encodeUTF8,format"
    import="../node_modules/jstrs/jstrs.js">*/
  var jstrs = require('jstrs');
  var encodeUTF8 = jstrs.encodeUTF8;
  var format = jstrs.format;
  /*</jdists>*/

  /**
   * 混淆 JS 代码
   *
   * @param {string} code JS 代码字符串
   * @param {Object} options 配置项
   * @param {string} options.type 混淆类型 'zero': 零宽字符, 'reverse': 颠掉字符
   * @param {string} options.breakout 是否导出函数
   * @param {string} options.prefix 参数前缀
   * @param {string} options.seed 随机种子
   * @return {string} 返回混淆后的代码
   */
  function obfuscate(code, options) {
    if (!code) {
      return code;
    }
    var guid = 0;

    options = options || {};
    var prefix = options.prefix || '$fog$';
    var seed = options.seed || Date.now();
    var random = generateRandomFunction(seed);
    var thisArg = options.thisArg || 'this';

    var mapping, includeMapping;
    if (options.mapping) {
      mapping = options.mapping;
      includeMapping = false;
    } else {
      mapping = [];
      includeMapping = true;
    }
    var mappingName = options.mappingName || identFrom(guid++);
    exports.mappingName = mappingName;

    function identFrom(index) {
      return prefix + index;
    }

    code = String(code).replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
      .replace(/^\uFEFF/, ''); // 数据清洗
    var syntax = esprimaInstance.parse(code, {
      range: true,
      loc: false
    });

    var breakoutVariants = [];
    if (options.breakout) { // 是否自动导出
      syntax.body.forEach(function(item) {
        if (item.type === 'VariableDeclaration') { // 变量定义
          item.declarations.forEach(function(sub) {
            breakoutVariants.push(sub.id.name);
          });
        } else if (item.type === 'FunctionDeclaration') { // 函数定义
          breakoutVariants.push(item.id.name);
        }
      });
    }

    var memberExpressions = [];
    var propertys = {};
    var names = [];
    var expressions = [];
    var ranges = {};

    function record(obj, name) {
      var range;
      if (obj.type === 'Literal') {
        range = obj.range;
      } else {
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

        if (/^(["']|\d)/.test(obj.raw)) {
          if (parentKey !== 'key') { // 不能是 JSON 的 key
            /* jslint evil: true */
            record(obj, JSON.stringify(eval(obj.raw)));
          }
        } else {
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
        items.forEach(function(item, index) {
          propertys[item] = names[index];
        });
        break;
    }

    /*<debug> //
    console.log(JSON.stringify(syntax, null, '  '));
    //</debug>*/
    memberExpressions.sort(function(a, b) {
      if (a.type === 'Literal') {
        a = a.range[1];
      } else {
        a = a.property.range[1];
      }
      if (b.type === 'Literal') {
        b = b.range[1];
      } else {
        b = b.property.range[1];
      }
      return b - a;
    }).forEach(function(obj) {
      if (obj.type === 'Literal') {
        var begin = code.slice(0, obj.range[0]);
        var end = code.slice(obj.range[1]);
        code = begin;
        if (/[^\s~!%^&*()_+\-={}\[\]|:";'<>,.?]$/.test(begin)) { // compress
          code += ' ';
        }
        code += propertys[obj.$name];
        if (/^[^\s~!%^&*()_+\-={}\[\]|:";'<>,.?]/.test(end)) {
          code += ' ';
        }
        code += end;
      } else { // if (obj.type === 'MemberExpression') {
        code = code.slice(0, obj.property.range[0]).replace(/\.\s*$/, '') +
          '[' + propertys[obj.$name] + ']' +
          code.slice(obj.property.range[1]);
      }
    });

    var decryption = '';
    var hasString; // 是否存在字符串处理
    var params = {};

    /*<jdists encoding="candy">*/
    switch (options.type) {
      case 'zero':
        var existsUnicode = false;
        expressions.every(function(item) {
          if (/[\u0100-\uffff]/.test(item)) {
            existsUnicode = true;
          }
          return !existsUnicode;
        });
        var t;
        if (existsUnicode) {
          t = parseInt('100000000', 2);
        } else {
          t = parseInt('10000000', 2);
        }
        expressions = expressions.map(function(item) {
          if (!(/^["]/.test(item)) || item.length <= 2) {
            return item;
          }
          hasString = true;
          var value = JSON.parse(item);
          if (existsUnicode) {
            value = encodeUTF8(value);
          }

          return '"' + value.replace(/[^]/g, function(all) {
            return (t + all.charCodeAt()).toString(2).substring(1).replace(/[^]/g, function(n) {
              return {
                0: '\u200c',
                1: '\u200d'
              }[n];
            });
          }) + '"';
        });
        if (hasString) {
          params = {
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
            parseInt: identFrom(guid++),
            rightToLeft: identFrom(guid++),
            u202e: '"\u202e"',
            6: identFrom(guid++),
            charCodeAt: identFrom(guid++),
            '0x0f': identFrom(guid++),
            '0x1f': identFrom(guid++),
            '0x3f': identFrom(guid++),
            regex3: identFrom(guid++),
            regex4: identFrom(guid++),
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
          if (existsUnicode) {
            expressions.push('/.{8}/g');
            names.push(params.regex3);
            expressions.push('/[\\u00c0-\\u00df][\\u0080-\\u00bf]/g');

            names.push(params.regex4);
            expressions.push('/[\\u00e0-\\u00ef][\\u0080-\\u00bf][\\u0080-\\u00bf]/g');

            names.push(params.charCodeAt);
            expressions.push('"charCodeAt"');

            names.push(params[6]);
            expressions.push(6);

            names.push(params['0x0f']);
            expressions.push(0x1f);

            names.push(params['0x1f']);
            expressions.push(0x1f);

            names.push(params['0x3f']);
            expressions.push(0x3f);
          } else {
            expressions.push('/.{7}/g');
          }

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

          if (existsUnicode) {
            decryption = format( /*#*/ function() {
              /*!
if (#{u202e} !== #{rightToLeft}) {
  return;
}

var #{argv} = arguments;
for (var #{index} = #{0}; #{index} < #{len}; #{index}++) {
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
  )[#{replace}](#{regex2}, function (a) {
    return #{String}[#{fromCharCode}](#{parseInt}(a, #{2}));
  })[#{replace}](
    #{regex3},
    function(c) {
      var cc = (c[#{charCodeAt}](#{0}) & #{0x1f}) << #{6} | (c[#{charCodeAt}](#{1}) & #{0x3f});
      return #{String}[#{fromCharCode}](cc);
    }
  )[#{replace}](
    #{regex4},
    function(c) {
      var cc = (c[#{charCodeAt}](#{0}) & #{0x0f}) << #{6} * #{2} | (c[#{charCodeAt}](#{1}) & #{0x3f}) << #{6} | (c[#{charCodeAt}](2) & #{0x3f});
      return #{String}[#{fromCharCode}](cc);
    }
  );
}
    */
            }, params);
          } else {
            decryption = format( /*#*/ function() {
              /*!
if (#{u202e} !== #{rightToLeft}) {
  return;
}

var #{argv} = arguments;
for (var #{index} = #{0}; #{index} < #{len}; #{index}++) {
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
  )[#{replace}](#{regex2}, function (a) {
    return #{String}[#{fromCharCode}](#{parseInt}(a, #{2}));
  });
}
    */
            }, params);
          }
        }
        break;
      case 'reverse':
        expressions = expressions.map(function(item) {
          if (/^"/.test(item)) {
            hasString = true;
            return JSON.stringify(JSON.parse(item).split('').reverse().join(''));
          }
          return item;
        });
        params = {
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
          rightToLeft: identFrom(guid++),
          u202e: '"\u202e"'
        };

        names.push(params.rightToLeft);
        expressions.push('"\u202e"'); // 干扰字符

        names.push(params.len);
        expressions.push(expressions.length - 1);

        if (hasString || expressions.length > 1) {

          decryption += format( /*#*/ function() {
            /*!
if (#{u202e} !== #{rightToLeft}) {
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

          decryption += format( /*#*/ function() {
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

          decryption += format( /*#*/ function() {
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
        if (options.type !== false) {
          var distracter = '"\u202e"';
          params = {
            rightToLeft: identFrom(guid++),
            u202e: distracter
          };
          names.unshift(params.rightToLeft);
          expressions.unshift(distracter); // 干扰字符
          decryption += format( /*#*/ function() {
          /*!
if (#{u202e} !== #{rightToLeft}) {
  return;
}
        */
          }, params);
        }
        break;
    }

    var argv = [];
    var mappingCode = '';
    var assigns = '';
    if (names.length > 0) {
      assigns = [];
      var _mappingInner = identFrom(guid++);
      names.forEach(function(name, idx) {
        var key = identFrom(guid++);
        var property = JSON.parse(expressions[idx]);
        var index = mapping.indexOf(property);
        if (index === -1) {
          index = mapping.length;
          mapping.push(property);
        }
        assigns.push(name + ' = ' + _mappingInner + '[' + index + ']');
      });
      argv[0] = _mappingInner;
      if (includeMapping) {
        expressions = [JSON.stringify(mapping)];
      } else {
        expressions = [mappingName];
      }
      assigns.sort(function(a,b){
        return random() < 0.5;
      });
      assigns = 'var ' + assigns.join(', ') + ';';
    }

    if (options.breakout && breakoutVariants.length) {

      var breakoutIdent = identFrom(guid++);
      var breakoutInside = breakoutVariants.map(function (name) {
        return format('#{ident}.#{name} = #{name};', {
          ident: breakoutIdent,
          name: name
        });
      }).join('\n');
      var breakoutOutside = breakoutVariants.map(function (name) {
        return format('var #{name} = #{ident}.#{name};', {
          ident: breakoutIdent,
          name: name
        });
      }).join('\n');

      return format( /*#*/ function() {
        /*!
var #{breakoutIdent} = {};
(function (#{argv}) {
  #{mapping}
  #{assigns}
  #{decryption}
  #{code}
  #{breakoutInside}
}).call(#{thisArg}, #{expressions});
#{breakoutOutside}
     */
      }, {
        breakoutIdent: breakoutIdent,
        breakoutInside: breakoutInside,
        breakoutOutside: breakoutOutside,

        argv: argv.join(', '),
        mapping: mappingCode,
        assigns: assigns,
        decryption: decryption,
        code: code,
        thisArg: thisArg,
        expressions: expressions.join(', ') || 'undefined'
      });
    }

    return format( /*#*/ function() {
      /*!
(function (#{argv}) {
  #{mapping}
  #{assigns}
  #{decryption}
  #{code}
}).call(#{thisArg}, #{expressions});
     */
    }, {
      argv: argv.join(', '),
      mapping: mappingCode,
      assigns: assigns,
      decryption: decryption,
      code: code,
      thisArg: thisArg,
      expressions: expressions.join(', ') || 'undefined'
    });
    /*</jdists>*/
  }

  function generateMapping(map){
    var n = exports.mappingName;
    return (n.indexOf(".") > 0?'':'var ') + n + ' = ' + JSON.stringify(map) + ';';
  }

  function generateRandomFunction(seed) {
    seed = seed || (Date.now() & 0xFFFFFF - 1);
    return function() {
      seed = (1103515245 * seed + 12345) & 2147483647;
      return seed / 2147483648;
    };
  }

  exports.obfuscate = obfuscate;
  exports.generateMapping = generateMapping;

  if (typeof define === 'function') {
    if (define.amd || define.cmd) {
      define(function() {
        return exports;
      });
    }
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  } else {
    window[exportName] = exports;
  }

})('jfogs');