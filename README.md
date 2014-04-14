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

For more information, see the [examples](example).


Changelog
---------

**0.2.1 (under development)**

* Fix: the `returnFirstHandler` is now only explicitly set when actually passed

**0.2**

* `returnFirstHandler` now defaults to `true` instead of `false`:

    ```coffee
    # old API:
    Logger.get('foo').debug('call from spindle.js')
    Logger.get('foo', true).debug('call from your code')()
    # new API:
    Logger.get('foo').debug('call from your code')()
    Logger.get('foo').debug('this does nothing') # simple returns a function to be called
    Logger.get('foo', false).debug('call from spindle.js')
    ```


**0.1**

* First public release; just getting it out there.


TODO
----
* Create tests
* Formatters


Credits
-------

`spindle.js` started as part of the [Goeie Jongens](http://goeiejongens.nl/) HTML5 toolkit.
