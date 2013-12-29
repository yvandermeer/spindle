require.config
    paths: do ->
        #staticPrefix = if require.isBrowser then window._staticUrl \
        #        else "#{process.env.PROJECT_ROOT}/static/"
        lib = '../../lib/'
        #appjs = '../js/'
        #www = "#{staticPrefix}www/"
        #wwwjs = "#{www}js-generated/"

        #'requireLib': "#{lib}requirejs/require"
        'spindle': '../spindle'

        'backbone': "#{lib}backbone/backbone"
        'handlebars': "#{lib}handlebars/handlebars"

        #'hb': "#{lib}requirejs-handlebars/hb"
        'jquery': "#{lib}jquery/jquery"
        #'jquery.cookie': "#{lib}jquery.cookie/jquery.cookie"
        #'jquery.hotkeys': "#{lib}jquery.hotkeys/jquery.hotkeys"
        #'text': "#{lib}requirejs-text/text"
        'underscore': "#{lib}underscore/underscore"
        #'zepto': "#{lib}zepto/zepto"

        # 'g0j0.devtools': "#{staticPrefix}g0j0/js/g0j0.dev_tools"
        # 'g0j0.magicselect': "#{staticPrefix}g0j0/js/g0j0.atwr.magicselect"

        # dev
        'blanket': "#{lib}blanket/dist/qunit/blanket"
        #'mocha-blanket': "#{lib}blanket/src/adapters/mocha-blanket"
        'chai': "#{lib}chai/chai"
        'mocha': "#{lib}mocha/mocha"
        'sinon': "#{lib}sinon/index"
        'sinon-chai': "#{lib}sinon-chai/lib/sinon-chai"

        'template': '../handlebars'
        'settings': 'empty:'

    #urlArgs: "bust=#{(new Date()).getTime()}"

    map:
        '*':
            'g0j0.logging': 'util/logger' # alias for backwards compatibility
            'ajaxlib': 'util/ajaxlib'

    packages: do ->
        #staticPrefix = if require.isBrowser then window._staticUrl \
        #        else "#{process.env.PROJECT_ROOT}/static/"
        [
            {
                name: 'spindle',
                #location: "#{staticPrefix}g0j0/js-generated/logger"
            },
            {
                name: 'g0j0/test',
                location: '../../lib/g0j0/js-generated/test'
            },
        ]

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
