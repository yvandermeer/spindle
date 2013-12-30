(function() {
  define(function(require) {
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
*/