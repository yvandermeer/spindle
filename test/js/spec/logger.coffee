define (require) ->
  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'Logger', ->
    baseTest()

    before (done) ->
      @sys.define
        LogLevel: 'spindle/logger'
      @sys.load(done)

    it '...', ->
