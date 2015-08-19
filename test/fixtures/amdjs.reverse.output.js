(function ($jfogs$0, $jfogs$1, $jfogs$2, $jfogs$3, $jfogs$4, $jfogs$5, $jfogs$6, $jfogs$7, $jfogs$8, $jfogs$9, $jfogs$10, $jfogs$11, $jfogs$12, $jfogs$13, $jfogs$14, $jfogs$15, $jfogs$16, $jfogs$17, $jfogs$18, $jfogs$19, $jfogs$20, $jfogs$21, $jfogs$22, $jfogs$23, $jfogs$24, $jfogs$25, $jfogs$26, $jfogs$27, $jfogs$28, $jfogs$29, $jfogs$30, $jfogs$31, $jfogs$32, $jfogs$33, $jfogs$34, $jfogs$35, $jfogs$36, $jfogs$37, $jfogs$38, $jfogs$39) {
var $jfogs$argv = arguments;
for (var $jfogs$i = 0; $jfogs$i < $jfogs$argv.length; $jfogs$i++) {
  $jfogs$argv[$jfogs$i] = $jfogs$argv[$jfogs$i].split("").reverse().join("");
}

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
    var _op = Object[$jfogs$0];
    var _os = _op[$jfogs$1];

    var _moduleMap = {};
    var _loadedMap = {};
    var _loadingMap = {};
    var _definedStack = [];
    var _anonymousId = 0;
    var env = {debug: 1, ts: 0};

    if (typeof win[$jfogs$2] !== 'undefined' && typeof win[$jfogs$3] !== 'undefined') {
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
            if (arguments[$jfogs$4] === 1) {
                factory = id;
                deps = null;
            } else if (arguments[$jfogs$4] === 2) {
                factory = deps;
                deps = id;
            }
            id = modName;
        } else if (isFunction(deps) && arguments[$jfogs$4] === 2) {
            factory = deps;
            deps = null;
        }
        _moduleMap[id] = {
            id: id,
            deps: deps,
            factory: factory
        };
        _definedStack[$jfogs$5](id);

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
        if (deps[$jfogs$4] === 1 && arguments[$jfogs$4] === 1) {
            return require[$jfogs$6](deps[$jfogs$7](''));
        }

        var loadDeps = filterLoadDeps(deps);
        var depsLen = loadDeps[$jfogs$4];
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
            if (hasProp(mod, 'deps') && mod[$jfogs$8]) {
                filterDeps = filterLoadDeps(mod[$jfogs$8]);
                filterLen = filterDeps[$jfogs$4];
            }
            if (filterLen > 0) {
                loadCount += filterLen - 1;
                for (var i = 0; i < filterLen; i++) {
                    var dep = filterDeps[i];
                    loadResources(dep, arguments[$jfogs$9]);
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
                exports[$jfogs$5](require[$jfogs$6](deps[index]));
            }
            callback && callback[$jfogs$10](undefined, exports);
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
    require[$jfogs$6] = function(id) {
        var module;
        var exports;
        var deps;
        var args = [];

        if (!hasProp(_moduleMap, id)) {
            throw new Error('Required unknown module, id: "' + id + '"');
        }

        module = getModule(id) || {};
        if (hasProp(module, 'exports')) {
            return module[$jfogs$11];
        }
        module[$jfogs$11] = exports = {};
        deps =  module[$jfogs$8];
        if (deps) {
            for (var depsLen = deps[$jfogs$4], i = 0; i < depsLen; i++) {
                var dep = deps[i];
                args[$jfogs$5](dep === 'require' ?
                    require : (dep === 'module' ?
                        module : (dep === 'exports' ? exports : require[$jfogs$6](dep))
                    )
                );
            }
        }

        if (isObject(module[$jfogs$12])) {
            module[$jfogs$11] = module[$jfogs$12];
        }
        else if (isFunction(module[$jfogs$12])) {
            var ret = module[$jfogs$12][$jfogs$10](undefined, args);
            if (ret !== undefined && ret !== exports) {
                module[$jfogs$11] = ret;
            }
        }
        return module[$jfogs$11];
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
            _loadingMap[url][$jfogs$5](callback);
        }
        else {
            _loadingMap[url] = [];
            var _head = doc[$jfogs$14]('head')[$jfogs$13];
            var script = doc[$jfogs$15]('script');
            script[$jfogs$16] = 'text/javascript';
            script[$jfogs$17] = url;
            script[$jfogs$18]('_md_', '_anymoore_' + url);
            _head[$jfogs$19](script);

            if (isFunction(callback)) {
                if (doc[$jfogs$20]) {
                    script[$jfogs$20]('load', onload, false);
                }
                else {
                    script[$jfogs$21] = function() {
                        if (/loaded|complete/[$jfogs$22](script[$jfogs$23])) {
                            script[$jfogs$21] = null;
                            onload();
                        }
                    };
                }
            }
        }

        function onload() {
            _loadedMap[url] = true;
            if (!env[$jfogs$24]) {
                _head[$jfogs$25](script);
            }

            var pathId = url[$jfogs$26](0, -3);
            var modName = _definedStack[$jfogs$27]();
            var mod = _moduleMap[modName];

            if (mod && pathId !== modName) {
                _moduleMap[pathId] = {alias: modName};
            }
            script = null;

            var cbStack = _loadingMap[url] || [];
            var cb = null;
            if (cbStack[$jfogs$4] > 0) {
                while (cb = cbStack[$jfogs$28]()) {
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
            url = (realId[$jfogs$26](-3) !== '.js') ? (realId + '.js') : realId;
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
        if (depsMod && depsMod[$jfogs$4] > 0) {
            for (var i = 0, len = depsMod[$jfogs$4]; i < len; i++) {
                if (depsMod[i] !== 'require' && depsMod[i] !== 'exports' && depsMod[i] !== 'module') {
                    filterDeps[$jfogs$5](depsMod[i]);
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
            module = _moduleMap[module[$jfogs$29]];
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
        if (path[$jfogs$30]('://') !== -1) {
            return path;
        }
        arr = path[$jfogs$31]('/');
        path = [];
        for (var k = 0, len = arr[$jfogs$4]; k < len; k++) {
            if (arr[k] === '.') {
                continue;
            }
            if (arr[k] === '..') {
                if (path[$jfogs$4] >= 2) {
                    path[$jfogs$27]();
                }
            }
            else {
                if (!path[$jfogs$4] || (arr[k] !== '')) {
                    path[$jfogs$5](arr[k]);
                }
            }
        }
        path = path[$jfogs$7]('/');
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
        return _op[$jfogs$33][$jfogs$32](obj, prop);
    }

    function isFunction(obj) {
        return _os[$jfogs$32](obj) === '[object Function]';
    }

    function isArray(obj) {
        return _os[$jfogs$32](obj) === '[object Array]';
    }

    function isObject(obj) {
        return _os[$jfogs$32](obj) === '[object Object]';
    }

    function log() {
        if (!env[$jfogs$24]) {
            return;
        }
        var apc = Array[$jfogs$0][$jfogs$26];
        win[$jfogs$34] && win[$jfogs$34][$jfogs$35][$jfogs$10](console, apc[$jfogs$32](arguments));
    }

    /*防止污染用户后加载的AMD/CMD加载器，统一先使用: _define_, _require_*/
    win[$jfogs$2] = define;
    win[$jfogs$3] = require;

    /*测试阶段，如果没有加载过requirejs之类，可直接暴露到window*/
    if (env[$jfogs$24] && typeof win[$jfogs$36] === 'undefined') {
        win[$jfogs$36] = win[$jfogs$2];
        win[$jfogs$37] = win[$jfogs$3];
    }

    define[$jfogs$38] = {};
    define[$jfogs$39] = '0.9.0';

})(window, document);
})("epytotorp", "gnirtSot", "_enifed_", "_eriuqer_", "htgnel", "hsup", "cnys", "nioj", "sped", "eellac", "ylppa", "stropxe", "yrotcaf", "0", "emaNgaTyBstnemelEteg", "tnemelEetaerc", "epyt", "crs", "etubirttAtes", "dlihCdneppa", "renetsiLtnevEdda", "egnahcetatsydaerno", "tset", "etatSydaer", "gubed", "dlihCevomer", "ecils", "pop", "tfihs", "saila", "fOxedni", "tilps", "llac", "ytreporPnwOsah", "elosnoc", "gol", "enifed", "eriuqer", "dma", "noisrev");