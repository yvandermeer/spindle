(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(function(require) {
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
        return _(this.stream['log'].bind).isFunction();
      };

      ConsoleHandler.prototype.getMethodForLevel = function(level) {
        var _ref;
        return (_ref = this.mappings[level]) != null ? _ref : 'log';
      };

      ConsoleHandler.prototype.emit = function(record) {
        var messages, method, _ref;
        method = this.getMethodForLevel(record.level);
        messages = _(record.messages).toArray();
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
*/