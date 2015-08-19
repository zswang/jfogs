(function ($jfogs$0, $jfogs$1, $jfogs$2, $jfogs$3, $jfogs$4, $jfogs$5, $jfogs$6, $jfogs$7, $jfogs$8, $jfogs$9, $jfogs$10, $jfogs$11, $jfogs$12, $jfogs$13, $jfogs$14, $jfogs$15, $jfogs$16, $jfogs$17, $jfogs$18, $jfogs$19, $jfogs$20, $jfogs$21, $jfogs$22, $jfogs$23, $jfogs$24, $jfogs$25, $jfogs$26, $jfogs$27, $jfogs$28, $jfogs$29, $jfogs$30, $jfogs$31, $jfogs$32, $jfogs$33, $jfogs$34, $jfogs$35, $jfogs$36, $jfogs$37, $jfogs$38, $jfogs$39) {
var $jfogs$prop = {};
$jfogs$prop.ؠ̀ = $jfogs$0;
$jfogs$prop.ء́ = $jfogs$1;
$jfogs$prop.آ̂ = $jfogs$2;
$jfogs$prop.أ̃ = $jfogs$3;
$jfogs$prop.ؤ̄ = $jfogs$4;
$jfogs$prop.إ̅ = $jfogs$5;
$jfogs$prop.ئ̆ = $jfogs$6;
$jfogs$prop.ا̇ = $jfogs$7;
$jfogs$prop.ب̈ = $jfogs$8;
$jfogs$prop.ة̉ = $jfogs$9;
$jfogs$prop.ت̊ = $jfogs$10;
$jfogs$prop.ث̋ = $jfogs$11;
$jfogs$prop.ج̌ = $jfogs$12;
$jfogs$prop.ح̍ = $jfogs$13;
$jfogs$prop.خ̎ = $jfogs$14;
$jfogs$prop.د̏ = $jfogs$15;
$jfogs$prop.ذ̐ = $jfogs$16;
$jfogs$prop.ر̑ = $jfogs$17;
$jfogs$prop.ز̒ = $jfogs$18;
$jfogs$prop.س̓ = $jfogs$19;
$jfogs$prop.ش̔ = $jfogs$20;
$jfogs$prop.ص̕ = $jfogs$21;
$jfogs$prop.ض̖ = $jfogs$22;
$jfogs$prop.ط̗ = $jfogs$23;
$jfogs$prop.ظ̘ = $jfogs$24;
$jfogs$prop.ع̙ = $jfogs$25;
$jfogs$prop.غ̚ = $jfogs$26;
$jfogs$prop.ػ̛ = $jfogs$27;
$jfogs$prop.ؼ̜ = $jfogs$28;
$jfogs$prop.ؽ̝ = $jfogs$29;
$jfogs$prop.ؾ̞ = $jfogs$30;
$jfogs$prop.ؿ̟ = $jfogs$31;
$jfogs$prop.ـ̠ = $jfogs$32;
$jfogs$prop.ف̡ = $jfogs$33;
$jfogs$prop.ق̢ = $jfogs$34;
$jfogs$prop.ك̣ = $jfogs$35;
$jfogs$prop.ء́ؠ̀ = $jfogs$36;
$jfogs$prop.ء́ء́ = $jfogs$37;
$jfogs$prop.ء́آ̂ = $jfogs$38;
$jfogs$prop.ء́أ̃ = $jfogs$39;

/**
 * Simple AMD Loader
 * A subset of Asynchronous Module Definition (AMD) API
 * Baidu LightApp Loader Provider
 *
 * @create: 2014.11.3
 * @update: 2014.12.4
 * @author: enimo <enimong@gmail.com>
 * @see: define, require, requirejs
 * AMD Draft: https://github.com/amdjs/amdjs-api/wiki/AMD
 * @formatter & jslint: fecs xx.js --check
 */

(function(win, doc) {

    var require;
    var define;
    var _op = Object[$jfogs$prop.ؠ̀];
    var _os = _op[$jfogs$prop.ء́];

    var _moduleMap = {};
    var _loadedMap = {};
    var _loadingMap = {};
    var _definedStack = [];
    var _anonymousId = 0;
    var env = {debug: 1, ts: 0};

    if (typeof win[$jfogs$prop.آ̂] !== 'undefined' && typeof win[$jfogs$prop.أ̃] !== 'undefined') {
        return;
    }

    /**
     * @description Define function implement
     *
     * @param {string} id 模块名
     * @param {Array} deps 依赖模块
     * @param {Function} factory 模块函数
     * @access public
    **/
    define = function(id, deps, factory) {
        if (hasProp(_moduleMap, id)) {
            return;
        }
        if (isFunction(id) || isArray(id) || isObject(id)) {
            var modName = '_anonymous_mod_' + _anonymousId++;
            if (arguments[$jfogs$prop.ؤ̄] === 1) {
                factory = id;
                deps = null;
            } else if (arguments[$jfogs$prop.ؤ̄] === 2) {
                factory = deps;
                deps = id;
            }
            id = modName;
        } else if (isFunction(deps) && arguments[$jfogs$prop.ؤ̄] === 2) {
            factory = deps;
            deps = null;
        }
        _moduleMap[id] = {
            id: id,
            deps: deps,
            factory: factory
        };
        _definedStack[$jfogs$prop.إ̅](id);

    };

    /**
     * @description require function implement
     *
     * @param {Array} deps 依赖模块
     * @param {Function} callback 回调函数
     * @access public
     * @return {Void}
    **/
    require = function(deps, callback) {
        if (typeof deps === 'string') {
            deps = [deps];
        }
        if (deps[$jfogs$prop.ؤ̄] === 1 && arguments[$jfogs$prop.ؤ̄] === 1) {
            return require[$jfogs$prop.ئ̆](deps[$jfogs$prop.ا̇](''));
        }

        var loadDeps = filterLoadDeps(deps);
        var depsLen = loadDeps[$jfogs$prop.ؤ̄];
        var loadCount = depsLen;
        if (depsLen) {
            for (var i = 0; i < depsLen; i++) {
                var depModName = loadDeps[i];
                loadResources(depModName, modResolved);
            }
        }
        else {
            allResolved();
        }

        function modResolved(modName) {
            var mod = getModule(modName) || {};
            var filterDeps = [];
            var filterLen = 0;
            if (hasProp(mod, 'deps') && mod[$jfogs$prop.ب̈]) {
                filterDeps = filterLoadDeps(mod[$jfogs$prop.ب̈]);
                filterLen = filterDeps[$jfogs$prop.ؤ̄];
            }
            if (filterLen > 0) {
                loadCount += filterLen - 1;
                for (var i = 0; i < filterLen; i++) {
                    var dep = filterDeps[i];
                    loadResources(dep, arguments[$jfogs$prop.ة̉]);
                }
            }
            else {
                if (--loadCount <= 0) {
                    allResolved();
                }
            }
        }

        function allResolved() {
            var exports = [];
            for (var index = 0; index < depsLen; index++) {
                exports[$jfogs$prop.إ̅](require[$jfogs$prop.ئ̆](deps[index]));
            }
            callback && callback[$jfogs$prop.ت̊](undefined, exports);
            exports = null;
        }
    };

    /**
     * @description require function implement
     * 兼容CMD同步调用:
     *    var mod = require.sync("mod");
     *
     * @param {string} id 依赖模块
     * @access public
     * @return {Void}
    **/
    require[$jfogs$prop.ئ̆] = function(id) {
        var module;
        var exports;
        var deps;
        var args = [];

        if (!hasProp(_moduleMap, id)) {
            throw new Error('Required unknown module, id: "' + id + '"');
        }

        module = getModule(id) || {};
        if (hasProp(module, 'exports')) {
            return module[$jfogs$prop.ث̋];
        }
        module[$jfogs$prop.ث̋] = exports = {};
        deps =  module[$jfogs$prop.ب̈];
        if (deps) {
            for (var depsLen = deps[$jfogs$prop.ؤ̄], i = 0; i < depsLen; i++) {
                var dep = deps[i];
                args[$jfogs$prop.إ̅](dep === 'require' ?
                    require : (dep === 'module' ?
                        module : (dep === 'exports' ? exports : require[$jfogs$prop.ئ̆](dep))
                    )
                );
            }
        }

        if (isObject(module[$jfogs$prop.ج̌])) {
            module[$jfogs$prop.ث̋] = module[$jfogs$prop.ج̌];
        }
        else if (isFunction(module[$jfogs$prop.ج̌])) {
            var ret = module[$jfogs$prop.ج̌][$jfogs$prop.ت̊](undefined, args);
            if (ret !== undefined && ret !== exports) {
                module[$jfogs$prop.ث̋] = ret;
            }
        }
        return module[$jfogs$prop.ث̋];
    };


    /**
     * @description 根据唯一的url地址加载js文件
     * @param {string} url load script uri
     * @param {Function} callback callback after loaded
    **/
    function loadScript(url, callback) {
        if (hasProp(_loadedMap, url)) {
            callback && callback();
        }
        else if (hasProp(_loadingMap, url)) {
            _loadingMap[url] = _loadingMap[url] || [];
            _loadingMap[url][$jfogs$prop.إ̅](callback);
        }
        else {
            _loadingMap[url] = [];
            var _head = doc[$jfogs$prop.خ̎]('head')[$jfogs$prop.ح̍];
            var script = doc[$jfogs$prop.د̏]('script');
            script[$jfogs$prop.ذ̐] = 'text/javascript';
            script[$jfogs$prop.ر̑] = url;
            script[$jfogs$prop.ز̒]('_md_', '_anymoore_' + url);
            _head[$jfogs$prop.س̓](script);

            if (isFunction(callback)) {
                if (doc[$jfogs$prop.ش̔]) {
                    script[$jfogs$prop.ش̔]('load', onload, false);
                }
                else {
                    script[$jfogs$prop.ص̕] = function() {
                        if (/loaded|complete/[$jfogs$prop.ض̖](script[$jfogs$prop.ط̗])) {
                            script[$jfogs$prop.ص̕] = null;
                            onload();
                        }
                    };
                }
            }
        }

        function onload() {
            _loadedMap[url] = true;
            if (!env[$jfogs$prop.ظ̘]) {
                _head[$jfogs$prop.ع̙](script);
            }

            var pathId = url[$jfogs$prop.غ̚](0, -3);
            var modName = _definedStack[$jfogs$prop.ػ̛]();
            var mod = _moduleMap[modName];

            if (mod && pathId !== modName) {
                _moduleMap[pathId] = {alias: modName};
            }
            script = null;

            var cbStack = _loadingMap[url] || [];
            var cb = null;
            if (cbStack[$jfogs$prop.ؤ̄] > 0) {
                while (cb = cbStack[$jfogs$prop.ؼ̜]()) {
                    cb && cb();
                }
                _loadingMap[url] = null;
            }
            callback && callback();
        }
    }

    /**
     * @description 根据给出depModName模块名，加载对应资源，根据是否在clouda环境中使用不同加载方式以及是否处理合并关系
     * @param {string} depModName Depends module name
     * @param {Function} callback callbak after loaded
    **/
    function loadResources(depModName, callback) {
        var url = null;
        if (depModName) {
            var realId = realpath(depModName);
            url = (realId[$jfogs$prop.غ̚](-3) !== '.js') ? (realId + '.js') : realId;
        }
        url && loadScript(url, function() {
            callback(depModName);
        });
    }

    /**
     * @description 加载deps资源时过滤保留id: module, require, exports
     * @param {Array} depsMod Depends modules
     * @return {Array} filterDeps
    **/
    function filterLoadDeps(depsMod) {
        var filterDeps = [];
        if (depsMod && depsMod[$jfogs$prop.ؤ̄] > 0) {
            for (var i = 0, len = depsMod[$jfogs$prop.ؤ̄]; i < len; i++) {
                if (depsMod[i] !== 'require' && depsMod[i] !== 'exports' && depsMod[i] !== 'module') {
                    filterDeps[$jfogs$prop.إ̅](depsMod[i]);
                }
            }
        }
        return filterDeps;
    }

    /**
     * @description 根据模块id获取模块实体对象
     * @param {string} id mod id
     * @return {Object} module
    **/
    function getModule(id) {
        if (!id || !hasProp(_moduleMap, id)) {
            log('%c_moduleMap中不存在该模块: "' + id + '"', 'color:red');
            return false;
        }
        var module = _moduleMap[id];
        if (hasProp(module, 'alias')) {
            module = _moduleMap[module[$jfogs$prop.ؽ̝]];
        }
        return module;
    }

    /**
     * @description Same as php realpath, 生成绝对路径
     * @param {string} path relative path
     * @return {string} realpath
    **/
    function realpath(path) {
        var arr = [];
        if (path[$jfogs$prop.ؾ̞]('://') !== -1) {
            return path;
        }
        arr = path[$jfogs$prop.ؿ̟]('/');
        path = [];
        for (var k = 0, len = arr[$jfogs$prop.ؤ̄]; k < len; k++) {
            if (arr[k] === '.') {
                continue;
            }
            if (arr[k] === '..') {
                if (path[$jfogs$prop.ؤ̄] >= 2) {
                    path[$jfogs$prop.ػ̛]();
                }
            }
            else {
                if (!path[$jfogs$prop.ؤ̄] || (arr[k] !== '')) {
                    path[$jfogs$prop.إ̅](arr[k]);
                }
            }
        }
        path = path[$jfogs$prop.ا̇]('/');
        /* return path.indexOf('/') === 0 ? path : '/' + path; //暂时不在path前加'/' */
        return path;
    }

    /**
     * @description Helper function, same as: 1,prop in obj; 2,key_exists(); 3.obj[prop]
     * @param {Object} obj original object
     * @param {string} prop property to check
     * @return {boolean}
    **/
    function hasProp(obj, prop) {
        return _op[$jfogs$prop.ف̡][$jfogs$prop.ـ̠](obj, prop);
    }

    function isFunction(obj) {
        return _os[$jfogs$prop.ـ̠](obj) === '[object Function]';
    }

    function isArray(obj) {
        return _os[$jfogs$prop.ـ̠](obj) === '[object Array]';
    }

    function isObject(obj) {
        return _os[$jfogs$prop.ـ̠](obj) === '[object Object]';
    }

    function log() {
        if (!env[$jfogs$prop.ظ̘]) {
            return;
        }
        var apc = Array[$jfogs$prop.ؠ̀][$jfogs$prop.غ̚];
        win[$jfogs$prop.ق̢] && win[$jfogs$prop.ق̢][$jfogs$prop.ك̣][$jfogs$prop.ت̊](console, apc[$jfogs$prop.ـ̠](arguments));
    }

    /*防止污染用户后加载的AMD/CMD加载器，统一先使用: _define_, _require_*/
    win[$jfogs$prop.آ̂] = define;
    win[$jfogs$prop.أ̃] = require;

    /*测试阶段，如果没有加载过requirejs之类，可直接暴露到window*/
    if (env[$jfogs$prop.ظ̘] && typeof win[$jfogs$prop.ء́ؠ̀] === 'undefined') {
        win[$jfogs$prop.ء́ؠ̀] = win[$jfogs$prop.آ̂];
        win[$jfogs$prop.ء́ء́] = win[$jfogs$prop.أ̃];
    }

    define[$jfogs$prop.ء́آ̂] = {};
    define[$jfogs$prop.ء́أ̃] = '0.9.0';

})(window, document);
})("prototype", "toString", "_define_", "_require_", "length", "push", "sync", "join", "deps", "callee", "apply", "exports", "factory", "0", "getElementsByTagName", "createElement", "type", "src", "setAttribute", "appendChild", "addEventListener", "onreadystatechange", "test", "readyState", "debug", "removeChild", "slice", "pop", "shift", "alias", "indexOf", "split", "call", "hasOwnProperty", "console", "log", "define", "require", "amd", "version");