require.config
  paths: do ->
    root = '../../'
    vendor = "#{root}vendor/"

    'spindle': "#{root}src/js/spindle"

    'backbone': "#{vendor}backbone/backbone"
    'handlebars': "#{vendor}handlebars/handlebars"
    'jquery': "#{vendor}jquery/dist/jquery"
    'underscore': "#{vendor}underscore/underscore"

    # dev
    'blanket': "#{vendor}blanket/dist/qunit/blanket"
    'chai': "#{vendor}chai/chai"
    'mocha': "#{vendor}mocha/mocha"
    'sinon': "#{vendor}sinon/index"
    'sinon-chai': "#{vendor}sinon-chai/lib/sinon-chai"
    'squire': "#{vendor}squire/src/Squire"
    'sugarspoon': "#{vendor}sugarspoon/src/js"

    'template': '../handlebars'

  shim:
    'backbone':
      deps: ['underscore', 'jquery']
      exports: 'Backbone'
    'handlebars':
      exports: 'Handlebars'
    'underscore':
      exports: '_'

    # dev
    'blanket':
      exports: 'blanket'
    'mocha':
      exports: 'mocha'
    'sinon':
      exports: 'sinon'
    'sinon-chai': ['sinon']
