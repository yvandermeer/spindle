define (require) ->
    _ = require 'underscore'

    LogHandler = require './base'
    LogLevel = require '../levels'


    class ConsoleHandler extends LogHandler

        @useBind: undefined # Determined in constructor

        stream: window.console
        mappings: {}

        constructor: ->
            ConsoleHandler.useBind ?= @checkForBind()
            @mappings[LogLevel.levels.CRITICAL] = 'error'
            @mappings[LogLevel.levels.ERROR] = 'error'
            @mappings[LogLevel.levels.WARNING] = 'warn'
            @mappings[LogLevel.levels.INFO] = 'info'
            @mappings[LogLevel.levels.DEBUG] = 'log'

        checkForBind: -> _.isFunction @stream['log'].bind

        getMethodForLevel: (level) ->
            @mappings[level] ? 'log'

        emit: (record) ->
            method = @getMethodForLevel record.level
            messages = _.toArray(record.messages)
            messages.splice(0, 0, "[#{record.name}]")
            if ConsoleHandler.useBind
                # Helps to make the log message shows up in the console as if
                # originating from the calling code
                @stream[method].bind @stream, messages...
            else
                @stream[method] messages
