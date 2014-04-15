module.exports = (grunt) ->

  require('jit-grunt')(grunt)


  class FileWatcher

    changedFiles: null

    constructor: (@tasks, options = {}) ->
      options.debounceDelay ?= 200
      @resetChangedFiles()
      @onChange = grunt.util._.debounce(@onChange, options.debounceDelay)

      grunt.event.on 'watch', (action, filepath) =>
        @changedFiles[filepath] = action
        @onChange()

    resetChangedFiles: ->
      @changedFiles = Object.create(null)

    onChange: =>
      changedFilepaths = Object.keys(@changedFiles)
      @limitTaskToFiles(taskName, changedFilepaths) \
          for taskName in @tasks
      @resetChangedFiles()

    limitTaskToFiles: (taskName, filepaths) ->
      filesConfig = "#{taskName}.files.0"
      cwd = grunt.config.get("#{filesConfig}.cwd")
      grunt.config("#{filesConfig}.src", @relativePaths(cwd, filepaths))

    relativePaths: (prefix, filepaths) ->
      prefix += '/'
      return (s.replace(prefix, '') for s in filepaths \
          when s.indexOf(prefix) is 0)


  new FileWatcher ['coffee.src', 'coffee.test']


  grunt.initConfig do ->
    dirs =
      javascript: '{src,test}/js'
      js_src: 'src/js'
    patterns =
      coffeescript: "#{dirs.js_src}/**/*.coffee"
      javascript: "#{dirs.javascript}/**/*.js"
      html: 'example/**/*.html'

    pkg: grunt.file.readJSON('package.json')

    coffee:
      src:
        files: [
          expand: true
          cwd: 'src/js'
          src: '**/*.coffee'
          dest: 'src/js'
          ext: '.js'
        ]
        options:
          sourceMap: true

      test:
        files: [
          expand: true
          cwd: 'test/js'
          src: '**/*.coffee'
          dest: 'test/js'
          ext: '.js'
        ]
        options:
          sourceMap: true

    coffeelint:
      options: grunt.file.readJSON('coffeelint.json')
      app: ["#{dirs.javascript}/**/*.coffee"]

    connect:
      dev:
        options:
          port: 9001
          #keepalive: true
          livereload: true

    uglify:
      dist:
        files:
          'spindle-min.js': ['spindle.js']

    watch:
      options:
        livereload: true

      coffee_src:
        options:
          spawn: false
        files: ['src/js/**/*.coffee']
        tasks: ['coffee:src']

      coffee_test:
        options:
          spawn: false
        files: ['test/js/**/*.coffee']
        tasks: ['coffee:test']

      livereload:
        files: [
          patterns.javascript,
          patterns.html,
        ]

    requirejs:
      compile:
        options: do ->
          baseUrl = dirs.js_src
          optimize = false

          baseUrl: baseUrl
          name: '../../vendor/almond/almond'
          include: [
            'spindle/main',
          ]
          exclude: [
            'underscore',
          ]
          paths:
            'underscore': '../../vendor/underscore/underscore'
          wrap:
            startFile: 'src/wrap/start.frag'
            endFile: 'src/wrap/end.frag'
          out: 'spindle.js'
          optimize: if optimize then 'uglify2' else 'none'
          preserveLicenseComments: not optimize
          onBuildWrite: (moduleName, path, contents) ->
            ###
            Fix the path to the the JavaScript source maps
            ###
            if moduleName.indexOf('spindle/') is 0
              regex = ///
                ^(//@\s+sourceMappingURL=) # prefix
                (.+)$ # path
              ///m
              prefix = 'src/js/spindle/'
              contents = contents.replace(regex, "$1#{prefix}$2")
            return contents

    clean: ["#{dirs.javascript}/**/*.{js,js.map}"]


  grunt.registerTask 'server', [
    # Open before connect because connect uses keepalive at the moment
    # so anything after connect wouldn't run
    'clean'
    'coffee'
    'connect'
    'watch'
  ]

  grunt.registerTask 'buildjs', ['clean', 'coffee', 'requirejs']

  grunt.registerTask 'build', ['buildjs', 'uglify']
