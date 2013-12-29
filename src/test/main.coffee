tests = [
    'levels',
]

# Help guarantee the order of suite execution
define ("spec/#{test}" for test in tests), ->
    suite?() for suite in arguments
