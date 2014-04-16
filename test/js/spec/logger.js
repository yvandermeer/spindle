(function() {
  define(function(require) {
    var baseTest;
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('Logger', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            LogLevel: 'spindle/logger'
          });
          return this.sys.load(done);
        });
        return it('...', function() {});
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=logger.js.map
*/