define (require) ->
    _ = require 'underscore'


    class LogLevel

        @levels:
            CRITICAL: 50
            ERROR: 40
            WARNING: 30
            INFO: 20
            DEBUG: 10
            NOTSET: 0

        @getLevelName: (level) ->
            _.invert(LogLevel.levels)[level]
