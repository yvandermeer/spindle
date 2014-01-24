(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
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
          if (returnFirstHandler != null) {
            instance.returnFirstHandler = returnFirstHandler;
          }
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
        this.returnFirstHandler = returnFirstHandler != null ? returnFirstHandler : true;
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
          rv = _(this.handlers).first().handle(record);
          this.callHandlers(record, _.rest(this.handlers));
          if (!_(rv).isFunction()) {
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
*/