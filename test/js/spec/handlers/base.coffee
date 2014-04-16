define (require) ->
  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'Base Log Handler', ->
    baseTest()

    before (done) ->
      @sys.define
        LogHandler: 'spindle/handlers/base'
      @sys.load(done)

    before ->
      class @sys.ExampleLogHandler extends @sys.LogHandler
        emit: ->
      @sandbox.spy(@sys.ExampleLogHandler::, 'emit')

      @util.createInstance = =>
        @_.handler = new @sys.ExampleLogHandler

      @util.createLogRecord = (options = {}) =>
        options.diff ?= 0
        record =
          name: 'example log record'
          level: @_.handler.level + options.diff
        return record


    describe 'handling a log record', ->

      before ->
        @util.handleLogRecordWithDiff = (diff) =>
          record = @util.createLogRecord(diff: diff)
          @_.handler.handle(record)

      beforeEach ->
        @util.createInstance()

      it 'emits if the record\'s level is higher', ->
        @util.handleLogRecordWithDiff(10)
        expect(@_.handler.emit).to.have.been.calledOnce

      it 'emits if the record\'s level is equal', ->
        @util.handleLogRecordWithDiff(0)
        expect(@_.handler.emit).to.have.been.calledOnce

      it 'does not emit if the record\'s level is lower', ->
        @util.handleLogRecordWithDiff(-10)
        expect(@_.handler.emit).not.to.have.been.called
