define (require) ->
    _ = require 'underscore'

    ConsoleHandler = require './handlers/consolehandler'
    LogLevel = require './levels'


    class Logger

        # Convenience
        @levels: LogLevel.levels
        @getLevelName: LogLevel.getLevelName

        # Singleton
        @_instances: {}

        @_fixupParents: (logger) ->
            name = logger.name
            i = name.lastIndexOf('.')
            rv = null
            while i > 0 and not rv
                substr = name.slice(0, i)
                if (instance = @_instances[substr])
                    rv = instance
                else
                    instance = null
                i = substr.lastIndexOf('.')
            if not rv
                rv = @root
            logger.parent = rv

        @get: (name, returnFirstHandler) ->
            return @root if not name

            # Even if we get an existing instance, make sure we set the
            # "returnFirstHandler" property as requested
            if (instance = @_instances[name]) and instance?
                instance.returnFirstHandler = returnFirstHandler
            else
                instance = new Logger arguments...

            @_fixupParents(instance)
            return instance

        disabledLevel: 0 # level for which logger is disabled

        constructor: (@name, @returnFirstHandler=false) ->
            #console.warn "Creating logger for #{@name}", arguments
            Logger._instances[@name] = @

            @level = LogLevel.levels.NOTSET

            @handlers = []
            @addHandler new ConsoleHandler

        addHandler: (handler) ->
            @handlers.push handler

        handle: (record) ->
            ###
            In "returnFirstHandler" mode, every hander is already invoked
            except the first one. The first one is returned, so it can be
            invoked by the code originally calling the log.

            This is primarily to allow for correct file names and line numbers
            in the browsers debug console (using ConsoleHandler).
            ###
            if @returnFirstHandler
                rv = _.first(@handlers).handle(record)
                @callHandlers record, _.rest @handlers
                # Make sure we return a callable function
                rv = @noop if not _.isFunction(rv)
                return rv
            else
                @callHandlers record
                return @noop

        callHandlers: (record, handlers) ->
            handlers ?= @handlers
            handler.handle(record)?() for handler in handlers

        setLevel: (@level) ->

        isEnabledFor: (level) ->
            return false if @disabledLevel >= level
            level >= @getEffectiveLevel()

        getEffectiveLevel: ->
            ###
            Returns the level of the first logger in the hierarchy that is set
            ###
            logger = @
            while logger
                return logger.level if logger.level
                logger = logger.parent
            return LogLevel.levels.NOTSET

        noop: ->
            #console.log '...'

        _log: (level, messages) ->
            return @noop if not @isEnabledFor level
            try
                @handle
                    name: @name
                    level: level
                    messages: messages
            catch e
                console?.warn?("#{e}")
                return @noop

        debug: -> @_log LogLevel.levels.DEBUG, arguments
        info: -> @_log LogLevel.levels.INFO, arguments
        warning: -> @_log LogLevel.levels.WARNING, arguments
        error: -> @_log LogLevel.levels.ERROR, arguments
        critical: -> @_log LogLevel.levels.CRITICAL, arguments

        log: -> @debug arguments...


    class RootLogger extends Logger

        constructor: -> super 'root'


    root = new RootLogger
    root.setLevel LogLevel.levels.WARNING
    Logger.root = root

    return Logger
