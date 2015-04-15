# lucid-router

hey there!  this is a super-simple html5-history aware router.
i'll push it to version `1.0.0` as soon as i have installed it via npm to confirm it works.

docs/examples/tests coming soon!

thanks to `url-pattern` for most of the route/pattern work.

quick-start
--------
```js
var router = require('lucid-router');

router.addRoutes([
  {name: 'a-key-you-can-use-later', path: '/some/path(/:optionalParam)', external: true-if-you-always-want-a-full-page-load-but-want-to-capture-params-on-that-page}
])

router.getLocation() // => an object with route info (name, path, state)
router.getLocation(path) // => same thing but uses the path provided instead of the current location (useful for server stuff)

router.navigate(path, e) // => navigates using the route table, pass event if you want it cancelled for you
router.navigatorFor(path)(e) // => same as above, curried style (useful for event binding)
```
