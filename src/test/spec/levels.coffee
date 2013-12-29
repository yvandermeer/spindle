define (require) ->
    _ = require 'underscore'


    describe 'LogLevel', ->

        before (done) ->
            require ['spindle/levels'], (@LogLevel) => done()


        describe 'get level name by value', ->

            levels =
                10: 'DEBUG'
                20: 'INFO'
                30: 'WARNING'
                40: 'ERROR'
                50: 'CRITICAL'

            _.each levels, (levelName, levelValue) =>
                levelValue = parseInt levelValue
                it "should return the proper value for #{levelName}", ->
                    expect(@LogLevel.getLevelName(levelValue)).to.equal(levelName)
