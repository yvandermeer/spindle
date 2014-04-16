define (require) ->
  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'Compatibility support', ->
    baseTest()

    before (done) ->
      @sys.define
        LogLevel: 'spindle/compat'
      @sys.load(done)

    it '...', ->
