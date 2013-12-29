define (require) ->
    TestRunner = require 'g0j0/test'


    runner = new TestRunner coverage: true
    runner.run('main')
