(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Allow using this built library as an AMD module in another project
        // Because almond cannot dynamically load dependencies itself, we have 
        // to require the dependencies up front and pass it to the factory.
        define(['underscore'], function(_) {
            return factory({
                underscore: _
            });
        });
    } else {
        // Browser globals case
        root.spindle = {
            Logger: factory({
                underscore: root._
            })
        };
    }
}(this, function (dependencies) {
