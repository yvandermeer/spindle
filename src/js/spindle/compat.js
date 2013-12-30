(function() {
  define(function(require) {
    var Logger, _base;
    Logger = require('./logger');
    window.g0j0 || (window.g0j0 = {});
    (_base = window.g0j0).logging || (_base.logging = {});
    return (function(ns) {
      var name, value, _ref;
      ns.getLogger = function(name) {
        return Logger.get(name);
      };
      _ref = Logger.levels;
      for (name in _ref) {
        value = _ref[name];
        ns[name] = value;
      }
      ns.configure || (ns.configure = function() {});
      return ns.configure();
    })(window.g0j0.logging);
  });

}).call(this);

/*
//@ sourceMappingURL=compat.js.map
*/