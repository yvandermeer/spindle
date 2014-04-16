(function() {
  define(function(require) {
    var baseTest;
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('Console Handler', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            LogLevel: 'spindle/handlers/consolehandler'
          });
          return this.sys.load(done);
        });
        return it('...', function() {});
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=consolehandler.js.map
*/