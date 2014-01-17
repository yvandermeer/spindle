(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Allow using this built library as an AMD module in another project
        // Because almond cannot dynamically load dependencies itself, we have 
        // to require the dependencies up front and pass it to the factory.
        define(['underscore'], function(_) {
            return factory({
                underscore: _
            });
        });
    } else {
        // Browser globals case
        root.spindle = {
            Logger: factory({
                underscore: root._
            })
        };
    }
}(this, function (dependencies) {

/**
 * almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../../vendor/almond/almond", function(){});

(function() {
  define('spindle/levels',['require','underscore'],function(require) {
    var LogLevel, _;
    _ = require('underscore');
    return LogLevel = (function() {
      function LogLevel() {}

      LogLevel.levels = {
        CRITICAL: 50,
        ERROR: 40,
        WARNING: 30,
        INFO: 20,
        DEBUG: 10,
        NOTSET: 0
      };

      LogLevel.getLevelName = function(level) {
        return _.invert(LogLevel.levels)[level];
      };

      return LogLevel;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=levels.js.map
*/;
(function() {
  define('spindle/handlers/base',['require','../levels'],function(require) {
    var LogHandler, LogLevel;
    LogLevel = require('../levels');
    return LogHandler = (function() {
      function LogHandler() {}

      LogHandler.prototype.level = LogLevel.levels.NOTSET;

      LogHandler.prototype.handle = function(record) {
        if (record.level >= this.level) {
          return this.emit(record);
        }
      };

      return LogHandler;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=base.js.map
*/;
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define('spindle/handlers/consolehandler',['require','underscore','./base','../levels'],function(require) {
    var ConsoleHandler, LogHandler, LogLevel, _;
    _ = require('underscore');
    LogHandler = require('./base');
    LogLevel = require('../levels');
    return ConsoleHandler = (function(_super) {
      __extends(ConsoleHandler, _super);

      ConsoleHandler.useBind = void 0;

      ConsoleHandler.prototype.stream = window.console;

      ConsoleHandler.prototype.mappings = {};

      function ConsoleHandler() {
        if (ConsoleHandler.useBind == null) {
          ConsoleHandler.useBind = this.checkForBind();
        }
        this.mappings[LogLevel.levels.CRITICAL] = 'error';
        this.mappings[LogLevel.levels.ERROR] = 'error';
        this.mappings[LogLevel.levels.WARNING] = 'warn';
        this.mappings[LogLevel.levels.INFO] = 'info';
        this.mappings[LogLevel.levels.DEBUG] = 'log';
      }

      ConsoleHandler.prototype.checkForBind = function() {
        return _.isFunction(this.stream['log'].bind);
      };

      ConsoleHandler.prototype.getMethodForLevel = function(level) {
        var _ref;
        return (_ref = this.mappings[level]) != null ? _ref : 'log';
      };

      ConsoleHandler.prototype.emit = function(record) {
        var messages, method, _ref;
        method = this.getMethodForLevel(record.level);
        messages = _.toArray(record.messages);
        messages.splice(0, 0, "[" + record.name + "]");
        if (ConsoleHandler.useBind) {
          return (_ref = this.stream[method]).bind.apply(_ref, [this.stream].concat(__slice.call(messages)));
        } else {
          return this.stream[method](messages);
        }
      };

      return ConsoleHandler;

    })(LogHandler);
  });

}).call(this);

/*
//@ sourceMappingURL=consolehandler.js.map
*/;
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('spindle/logger',['require','underscore','./handlers/consolehandler','./levels'],function(require) {
    var ConsoleHandler, LogLevel, Logger, RootLogger, root, _;
    _ = require('underscore');
    ConsoleHandler = require('./handlers/consolehandler');
    LogLevel = require('./levels');
    Logger = (function() {
      Logger.levels = LogLevel.levels;

      Logger.getLevelName = LogLevel.getLevelName;

      Logger._instances = {};

      Logger._fixupParents = function(logger) {
        var i, instance, name, rv, substr;
        name = logger.name;
        i = name.lastIndexOf('.');
        rv = null;
        while (i > 0 && !rv) {
          substr = name.slice(0, i);
          if ((instance = this._instances[substr])) {
            rv = instance;
          } else {
            instance = null;
          }
          i = substr.lastIndexOf('.');
        }
        if (!rv) {
          rv = this.root;
        }
        return logger.parent = rv;
      };

      Logger.get = function(name, returnFirstHandler) {
        var instance;
        if (!name) {
          return this.root;
        }
        if ((instance = this._instances[name]) && (instance != null)) {
          instance.returnFirstHandler = returnFirstHandler;
        } else {
          instance = (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(Logger, arguments, function(){});
        }
        this._fixupParents(instance);
        return instance;
      };

      Logger.prototype.disabledLevel = 0;

      function Logger(name, returnFirstHandler) {
        this.name = name;
        this.returnFirstHandler = returnFirstHandler != null ? returnFirstHandler : false;
        Logger._instances[this.name] = this;
        this.level = LogLevel.levels.NOTSET;
        this.handlers = [];
        this.addHandler(new ConsoleHandler);
      }

      Logger.prototype.addHandler = function(handler) {
        return this.handlers.push(handler);
      };

      Logger.prototype.handle = function(record) {
        /*
        In "returnFirstHandler" mode, every hander is already invoked
        except the first one. The first one is returned, so it can be
        invoked by the code originally calling the log.
        
        This is primarily to allow for correct file names and line numbers
        in the browsers debug console (using ConsoleHandler).
        */

        var rv;
        if (this.returnFirstHandler) {
          rv = _.first(this.handlers).handle(record);
          this.callHandlers(record, _.rest(this.handlers));
          if (!_.isFunction(rv)) {
            rv = this.noop;
          }
          return rv;
        } else {
          this.callHandlers(record);
          return this.noop;
        }
      };

      Logger.prototype.callHandlers = function(record, handlers) {
        var handler, _base, _i, _len, _results;
        if (handlers == null) {
          handlers = this.handlers;
        }
        _results = [];
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          _results.push(typeof (_base = handler.handle(record)) === "function" ? _base() : void 0);
        }
        return _results;
      };

      Logger.prototype.setLevel = function(level) {
        this.level = level;
      };

      Logger.prototype.isEnabledFor = function(level) {
        if (this.disabledLevel >= level) {
          return false;
        }
        return level >= this.getEffectiveLevel();
      };

      Logger.prototype.getEffectiveLevel = function() {
        /*
        Returns the level of the first logger in the hierarchy that is set
        */

        var logger;
        logger = this;
        while (logger) {
          if (logger.level) {
            return logger.level;
          }
          logger = logger.parent;
        }
        return LogLevel.levels.NOTSET;
      };

      Logger.prototype.noop = function() {};

      Logger.prototype._log = function(level, messages) {
        var e;
        if (!this.isEnabledFor(level)) {
          return this.noop;
        }
        try {
          return this.handle({
            name: this.name,
            level: level,
            messages: messages
          });
        } catch (_error) {
          e = _error;
          if (typeof console !== "undefined" && console !== null) {
            if (typeof console.warn === "function") {
              console.warn("" + e);
            }
          }
          return this.noop;
        }
      };

      Logger.prototype.debug = function() {
        return this._log(LogLevel.levels.DEBUG, arguments);
      };

      Logger.prototype.info = function() {
        return this._log(LogLevel.levels.INFO, arguments);
      };

      Logger.prototype.warning = function() {
        return this._log(LogLevel.levels.WARNING, arguments);
      };

      Logger.prototype.error = function() {
        return this._log(LogLevel.levels.ERROR, arguments);
      };

      Logger.prototype.critical = function() {
        return this._log(LogLevel.levels.CRITICAL, arguments);
      };

      Logger.prototype.log = function() {
        return this.debug.apply(this, arguments);
      };

      return Logger;

    })();
    RootLogger = (function(_super) {
      __extends(RootLogger, _super);

      function RootLogger() {
        RootLogger.__super__.constructor.call(this, 'root');
      }

      return RootLogger;

    })(Logger);
    root = new RootLogger;
    root.setLevel(LogLevel.levels.WARNING);
    Logger.root = root;
    return Logger;
  });

}).call(this);

/*
//@ sourceMappingURL=logger.js.map
*/;
(function() {
  define('spindle/compat',['require','./logger'],function(require) {
    var Logger, _base;
    Logger = require('./logger');
    window.g0j0 || (window.g0j0 = {});
    (_base = window.g0j0).logging || (_base.logging = {});
    return (function(ns) {
      var name, value, _ref;
      ns.getLogger = function(name) {
        return Logger.get(name);
      };
      _ref = Logger.levels;
      for (name in _ref) {
        value = _ref[name];
        ns[name] = value;
      }
      ns.configure || (ns.configure = function() {});
      return ns.configure();
    })(window.g0j0.logging);
  });

}).call(this);

/*
//@ sourceMappingURL=compat.js.map
*/;
(function() {
  define('spindle/main',['require','./logger','./compat'],function(require) {
    var Logger;
    Logger = require('./logger');
    require('./compat');
    return Logger;
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/;
    define('underscore', function() {
        return dependencies.underscore;
    });

    // The modules for your project will be inlined above
    // this snippet. Ask almond to synchronously require the
    // module value for 'main' here and return it as the
    // value to use for the public API for the built file.
    return require('spindle/main');
}));
