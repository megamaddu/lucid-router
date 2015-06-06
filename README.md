# lucid-router

Simple (lucid) html5 history-aware router.  Extracted from (and now being used by) a production React app for both client and server routing (gotta get that isomorphic buzz word in there).

Thanks to `url-pattern` for most of the route/pattern work.

example
--------
```js
var router = require('lucid-router');

router.addRoutes([
  {name: 'a-key-you-can-use-later', path: '/some/path(/:optionalParam)', external: 'optional, set to `true` if you always want a full page load but still want to capture params on that page'}
])

router.getLocation() // => an object with route info (name, path, state)
router.getLocation(path) // => same thing but uses the path provided instead of the current location (useful for server stuff)

router.navigate(path, e) // => navigates using the route table, pass event if you want it cancelled for you
router.navigatorFor(path)(e) // => same as above, curried style (useful for event binding)
```
