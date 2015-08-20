
(function ($fog$0, $fog$1, $fog$2, $fog$3, $fog$4, $fog$5, $fog$6, $fog$7, $fog$8, $fog$9, $fog$10, $fog$11, $fog$12, $fog$13, $fog$14, $fog$15, $fog$16, $fog$17, $fog$18, $fog$19, $fog$20, $fog$21, $fog$22, $fog$23, $fog$24, $fog$25, $fog$26, $fog$27, $fog$28, $fog$29, $fog$30, $fog$31, $fog$32, $fog$33, $fog$34, $fog$35, $fog$36, $fog$37, $fog$38, $fog$39, $fog$40, $fog$41, $fog$42, $fog$43, $fog$44, $fog$45, $fog$46, $fog$47, $fog$48, $fog$49, $fog$50, $fog$51, $fog$52, $fog$53, $fog$54, $fog$55, $fog$56, $fog$57, $fog$58, $fog$59, $fog$60, $fog$61, $fog$62, $fog$63, $fog$64, $fog$65, $fog$66, $fog$67, $fog$68, $fog$69, $fog$70) {
  
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
    var _op = Object[$fog$0];
    var _os = _op[$fog$1];

    var _moduleMap = {};
    var _loadedMap = {};
    var _loadingMap = {};
    var _definedStack = [];
    var _anonymousId = $fog$2;
    var env = {debug: $fog$3, ts: $fog$2};

    if (typeof win[$fog$4] !== $fog$5 && typeof win[$fog$6] !== $fog$5) {
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
            var modName = $fog$7 + _anonymousId++;
            if (arguments[$fog$8] === $fog$3) {
                factory = id;
                deps = $fog$9;
            } else if (arguments[$fog$8] === $fog$10) {
                factory = deps;
                deps = id;
            }
            id = modName;
        } else if (isFunction(deps) && arguments[$fog$8] === $fog$10) {
            factory = deps;
            deps = $fog$9;
        }
        _moduleMap[id] = {
            id: id,
            deps: deps,
            factory: factory
        };
        _definedStack[$fog$11](id);

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
        if (typeof deps === $fog$12) {
            deps = [deps];
        }
        if (deps[$fog$8] === $fog$3 && arguments[$fog$8] === $fog$3) {
            return require[$fog$13](deps[$fog$14]($fog$15));
        }

        var loadDeps = filterLoadDeps(deps);
        var depsLen = loadDeps[$fog$8];
        var loadCount = depsLen;
        if (depsLen) {
            for (var i = $fog$2; i < depsLen; i++) {
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
            var filterLen = $fog$2;
            if (hasProp(mod, $fog$16) && mod[$fog$16]) {
                filterDeps = filterLoadDeps(mod[$fog$16]);
                filterLen = filterDeps[$fog$8];
            }
            if (filterLen > $fog$2) {
                loadCount += filterLen - $fog$3;
                for (var i = $fog$2; i < filterLen; i++) {
                    var dep = filterDeps[i];
                    loadResources(dep, arguments[$fog$17]);
                }
            }
            else {
                if (--loadCount <= $fog$2) {
                    allResolved();
                }
            }
        }

        function allResolved() {
            var exports = [];
            for (var index = $fog$2; index < depsLen; index++) {
                exports[$fog$11](require[$fog$13](deps[index]));
            }
            callback && callback[$fog$18](undefined, exports);
            exports = $fog$9;
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
    require[$fog$13] = function(id) {
        var module;
        var exports;
        var deps;
        var args = [];

        if (!hasProp(_moduleMap, id)) {
            throw new Error($fog$19 + id + $fog$20);
        }

        module = getModule(id) || {};
        if (hasProp(module, $fog$21)) {
            return module[$fog$21];
        }
        module[$fog$21] = exports = {};
        deps =  module[$fog$16];
        if (deps) {
            for (var depsLen = deps[$fog$8], i = $fog$2; i < depsLen; i++) {
                var dep = deps[i];
                args[$fog$11](dep === $fog$22 ?
                    require : (dep === $fog$23 ?
                        module : (dep === $fog$21 ? exports : require[$fog$13](dep))
                    )
                );
            }
        }

        if (isObject(module[$fog$24])) {
            module[$fog$21] = module[$fog$24];
        }
        else if (isFunction(module[$fog$24])) {
            var ret = module[$fog$24][$fog$18](undefined, args);
            if (ret !== undefined && ret !== exports) {
                module[$fog$21] = ret;
            }
        }
        return module[$fog$21];
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
            _loadingMap[url][$fog$11](callback);
        }
        else {
            _loadingMap[url] = [];
            var _head = doc[$fog$25]($fog$26)[$fog$2];
            var script = doc[$fog$27]($fog$28);
            script[$fog$29] = $fog$30;
            script[$fog$31] = url;
            script[$fog$32]($fog$33, $fog$34 + url);
            _head[$fog$35](script);

            if (isFunction(callback)) {
                if (doc[$fog$36]) {
                    script[$fog$36]($fog$37, onload, $fog$38);
                }
                else {
                    script[$fog$39] = function() {
                        if ($fog$41[$fog$40](script[$fog$42])) {
                            script[$fog$39] = $fog$9;
                            onload();
                        }
                    };
                }
            }
        }

        function onload() {
            _loadedMap[url] = $fog$43;
            if (!env[$fog$44]) {
                _head[$fog$45](script);
            }

            var pathId = url[$fog$46]($fog$2, -$fog$47);
            var modName = _definedStack[$fog$48]();
            var mod = _moduleMap[modName];

            if (mod && pathId !== modName) {
                _moduleMap[pathId] = {alias: modName};
            }
            script = $fog$9;

            var cbStack = _loadingMap[url] || [];
            var cb = $fog$9;
            if (cbStack[$fog$8] > $fog$2) {
                while (cb = cbStack[$fog$49]()) {
                    cb && cb();
                }
                _loadingMap[url] = $fog$9;
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
        var url = $fog$9;
        if (depModName) {
            var realId = realpath(depModName);
            url = (realId[$fog$46](-$fog$47) !== $fog$50) ? (realId + $fog$50) : realId;
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
        if (depsMod && depsMod[$fog$8] > $fog$2) {
            for (var i = $fog$2, len = depsMod[$fog$8]; i < len; i++) {
                if (depsMod[i] !== $fog$22 && depsMod[i] !== $fog$21 && depsMod[i] !== $fog$23) {
                    filterDeps[$fog$11](depsMod[i]);
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
            log($fog$51 + id + $fog$20, $fog$52);
            return $fog$38;
        }
        var module = _moduleMap[id];
        if (hasProp(module, $fog$53)) {
            module = _moduleMap[module[$fog$53]];
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
        if (path[$fog$54]($fog$55) !== -$fog$3) {
            return path;
        }
        arr = path[$fog$56]($fog$57);
        path = [];
        for (var k = $fog$2, len = arr[$fog$8]; k < len; k++) {
            if (arr[k] === $fog$58) {
                continue;
            }
            if (arr[k] === $fog$59) {
                if (path[$fog$8] >= $fog$10) {
                    path[$fog$48]();
                }
            }
            else {
                if (!path[$fog$8] || (arr[k] !== $fog$15)) {
                    path[$fog$11](arr[k]);
                }
            }
        }
        path = path[$fog$14]($fog$57);
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
        return _op[$fog$61][$fog$60](obj, prop);
    }

    function isFunction(obj) {
        return _os[$fog$60](obj) === $fog$62;
    }

    function isArray(obj) {
        return _os[$fog$60](obj) === $fog$63;
    }

    function isObject(obj) {
        return _os[$fog$60](obj) === $fog$64;
    }

    function log() {
        if (!env[$fog$44]) {
            return;
        }
        var apc = Array[$fog$0][$fog$46];
        win[$fog$65] && win[$fog$65][$fog$66][$fog$18](console, apc[$fog$60](arguments));
    }

    /*防止污染用户后加载的AMD/CMD加载器，统一先使用: _define_, _require_*/
    win[$fog$4] = define;
    win[$fog$6] = require;

    /*测试阶段，如果没有加载过requirejs之类，可直接暴露到window*/
    if (env[$fog$44] && typeof win[$fog$67] === $fog$5) {
        win[$fog$67] = win[$fog$4];
        win[$fog$22] = win[$fog$6];
    }

    define[$fog$68] = {};
    define[$fog$69] = $fog$70;

})(window, document);
})("prototype", "toString", 0, 1, "_define_", "undefined", "_require_", "_anonymous_mod_", "length", null, 2, "push", "string", "sync", "join", "", "deps", "callee", "apply", "Required unknown module, id: \"", "\"", "exports", "require", "module", "factory", "getElementsByTagName", "head", "createElement", "script", "type", "text/javascript", "src", "setAttribute", "_md_", "_anymoore_", "appendChild", "addEventListener", "load", false, "onreadystatechange", "test", /loaded|complete/, "readyState", true, "debug", "removeChild", "slice", 3, "pop", "shift", ".js", "%c_moduleMap中不存在该模块: \"", "color:red", "alias", "indexOf", "://", "split", "/", ".", "..", "call", "hasOwnProperty", "[object Function]", "[object Array]", "[object Object]", "console", "log", "define", "amd", "version", "0.9.0");
     