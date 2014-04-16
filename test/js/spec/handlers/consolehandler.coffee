define (require) ->
  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'Console Handler', ->
    baseTest()

    before (done) ->
      @sys.define
        LogLevel: 'spindle/handlers/consolehandler'
      @sys.load(done)

    it '...', ->
