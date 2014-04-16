(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var baseTest;
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('Base Log Handler', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            LogHandler: 'spindle/handlers/base'
          });
          return this.sys.load(done);
        });
        before(function() {
          var _ref,
            _this = this;
          this.sys.ExampleLogHandler = (function(_super) {
            __extends(ExampleLogHandler, _super);

            function ExampleLogHandler() {
              _ref = ExampleLogHandler.__super__.constructor.apply(this, arguments);
              return _ref;
            }

            ExampleLogHandler.prototype.emit = function() {};

            return ExampleLogHandler;

          })(this.sys.LogHandler);
          this.sandbox.spy(this.sys.ExampleLogHandler.prototype, 'emit');
          this.util.createInstance = function() {
            return _this._.handler = new _this.sys.ExampleLogHandler;
          };
          return this.util.createLogRecord = function(options) {
            var record;
            if (options == null) {
              options = {};
            }
            if (options.diff == null) {
              options.diff = 0;
            }
            record = {
              name: 'example log record',
              level: _this._.handler.level + options.diff
            };
            return record;
          };
        });
        return describe('handling a log record', function() {
          before(function() {
            var _this = this;
            return this.util.handleLogRecordWithDiff = function(diff) {
              var record;
              record = _this.util.createLogRecord({
                diff: diff
              });
              return _this._.handler.handle(record);
            };
          });
          beforeEach(function() {
            return this.util.createInstance();
          });
          it('emits if the record\'s level is higher', function() {
            this.util.handleLogRecordWithDiff(10);
            return expect(this._.handler.emit).to.have.been.calledOnce;
          });
          it('emits if the record\'s level is equal', function() {
            this.util.handleLogRecordWithDiff(0);
            return expect(this._.handler.emit).to.have.been.calledOnce;
          });
          return it('does not emit if the record\'s level is lower', function() {
            this.util.handleLogRecordWithDiff(-10);
            return expect(this._.handler.emit).not.to.have.been.called;
          });
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=base.js.map
*/