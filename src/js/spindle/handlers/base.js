(function() {
  define(function(require) {
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
*/