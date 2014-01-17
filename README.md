spindle.js
==========

A JavaScript logging library, largely inspired by the [Python logging module](http://docs.python.org/2/library/logging.html).

A simple example:

```javascript
var logger = spindle.Logger.get('foo.bar');
logger.setLevel(spindle.Logger.levels.DEBUG);
logger.debug('a debug message');
// Calls: console.log('[foo.bar] a debug message')
logger.warning('a warning message');
// Calls: console.warn('[foo.bar] a warning message')
```


Installation & dependencies
---------------------------
Using bower:

    $ bower install spindle


Spindle depends on [underscore.js](http://underscorejs.org).

Usages
------
Spindle works both with and without AMD (RequireJS).

For more information, see the [examples](examples) directory.


Changelog
---------

**0.1**

* First public release; just getting it out there.


TODO
----
* Create tests
* Formatters
