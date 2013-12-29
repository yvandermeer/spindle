define (require) ->
    LogLevel = require '../levels'


    class LogHandler

        level: LogLevel.levels.NOTSET

        handle: (record) ->
            @emit record if record.level >= @level
