(function() {
  require.config({
    paths: (function() {
      var root, vendor;
      root = '../../';
      vendor = "" + root + "vendor/";
      return {
        'spindle': "" + root + "src/js/spindle",
        'backbone': "" + vendor + "backbone/backbone",
        'handlebars': "" + vendor + "handlebars/handlebars",
        'jquery': "" + vendor + "jquery/dist/jquery",
        'underscore': "" + vendor + "underscore/underscore",
        'blanket': "" + vendor + "blanket/dist/qunit/blanket",
        'chai': "" + vendor + "chai/chai",
        'mocha': "" + vendor + "mocha/mocha",
        'sinon': "" + vendor + "sinon/index",
        'sinon-chai': "" + vendor + "sinon-chai/lib/sinon-chai",
        'squire': "" + vendor + "squire/src/Squire",
        'sugarspoon': "" + vendor + "sugarspoon/src/js",
        'template': '../handlebars'
      };
    })(),
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      'handlebars': {
        exports: 'Handlebars'
      },
      'underscore': {
        exports: '_'
      },
      'blanket': {
        exports: 'blanket'
      },
      'mocha': {
        exports: 'mocha'
      },
      'sinon': {
        exports: 'sinon'
      },
      'sinon-chai': ['sinon']
    }
  });

}).call(this);

/*
//@ sourceMappingURL=config.js.map
*/