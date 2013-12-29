module.exports = (grunt) ->

    grunt.initConfig do ->
        #staticBaseDir = 'src'
        dirs =
            coffeescript: 'src'
            javascriptGenerated: "dist"
        patterns =
            coffeescript: 'src/**/*.coffee'
            javascriptGenerated: "#{dirs.javascriptGenerated}/**/*.js"

        pkg: grunt.file.readJSON('package.json')

        coffee:
            options:
                sourceMap: true
            glob_to_multiple:
                expand: true
                flatten: false
                cwd: dirs.coffeescript
                src: ['**/*.coffee']
                dest: dirs.javascriptGenerated
                ext: '.js'

        connect:
            server:
                options:
                    port: 9001
                    #base: 'test'
                    keepalive: true

        watch:
            coffee:
                files: [patterns.coffeescript]
                tasks: ['coffee']
                options:
                    nospawn: true
                    livereload: true
            livereload:
                options:
                    livereload: true
                files: [
                    patterns.javascriptGenerated,
                ]


    # Based on https://github.com/gruntjs/grunt-contrib-watch#compiling-files-as-needed
    changedFiles = Object.create(null)
    onChange = grunt.util._.debounce ->
        filepaths = Object.keys(changedFiles)

        # Selectively compile changed CoffeeScript files
        cwd = grunt.config 'coffee.glob_to_multiple.cwd'
        filepathsRelative = grunt.util._.map filepaths, (s) -> s.replace "#{cwd}/", ''
        grunt.config 'coffee.glob_to_multiple.src', filepathsRelative

        changedFiles = Object.create(null)
    , 200
    grunt.event.on 'watch', (action, filepath) ->
        changedFiles[filepath] = action
        onChange()


    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-contrib-watch'
