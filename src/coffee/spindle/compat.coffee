define (require) ->
    Logger = require './logger'


    window.g0j0 or= {}
    window.g0j0.logging or= {}

    do (ns = window.g0j0.logging) ->
        ns.getLogger = (name) ->
            Logger.get(name)

        # Copy log levels to top-level namespace
        ns[name] = value for name, value of Logger.levels

        # No-op, can be user-defined
        ns.configure or= ->

        # Configure right away
        ns.configure()
