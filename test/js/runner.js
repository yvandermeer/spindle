(function() {
  define(function(require) {
    var TestRunner, runner, tests;
    TestRunner = require('sugarspoon/main');
    tests = require('./main');
    runner = new TestRunner;
    return runner.run(tests);
  });

}).call(this);

/*
//@ sourceMappingURL=runner.js.map
*/