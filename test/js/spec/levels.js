(function() {
  define(function(require) {
    var baseTest, _;
    _ = require('underscore');
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('LogLevel', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            LogLevel: 'spindle/levels'
          });
          return this.sys.load(done);
        });
        return describe('get level name by value', function() {
          var levels;
          levels = {
            10: 'DEBUG',
            20: 'INFO',
            30: 'WARNING',
            40: 'ERROR',
            50: 'CRITICAL'
          };
          return _.each(levels, function(levelName, levelValue) {
            levelValue = parseInt(levelValue);
            return it("should return the proper value for " + levelName, function() {
              return expect(this.sys.LogLevel.getLevelName(levelValue)).to.equal(levelName);
            });
          });
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=levels.js.map
*/