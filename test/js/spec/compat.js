(function() {
  define(function(require) {
    var baseTest;
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('Compatibility support', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            LogLevel: 'spindle/compat'
          });
          return this.sys.load(done);
        });
        return it('...', function() {});
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=compat.js.map
*/