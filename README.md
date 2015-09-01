# lucid-router

Simple (lucid) html5 history-aware router.  Extracted from (and now being used by) a production React app for both client and server routing (gotta get that isomorphic buzz word in there).

Thanks to `url-pattern` for all of the route/pattern work!

## example

### building a router
Require the router anywhere it will be used and add routes.  Routes are stored inside the `lucid-router` module, so it is safe to destructure or pass the router's functions around without any binding (see below).
```js
var router = require('lucid-router');

router.addRoutes([
  {name: 'profile', path: '/profiles/:profileId'}, // required param
  {name: 'home',    path: '(/:category)'}          // optional param
]);
```

You can also set an `external` property on the route definition.  This flag can be a boolean or a function which takes an object containing the route matching info and returns a boolean.  `false` will allow the normal route transition to occur, while `true` will cancel the location change event and instead navigate the browser directly to the url for a full page load.  This setting is mainly for hybrid classic/SPA apps.
```js
router.addRoutes([
  {name: 'profile', path: '/non-spa-route' , external: true | false | (matchInfo => true | false)}
]);
```

Also note that routes can be added or removed (see `router.removeRoute(name)`) at any time, allowing different parts of a larger application to asynchronously inject SPA features into an app as it loads.  If a navigation occurs before the necessary route exists, a normal browser redirect will occur.

`getLocation` returns a `RouterLocation` object, or `null` if no routes match.  See the [Flow types](https://github.com/spicydonuts/lucid-router/blob/master/lib/lucid-router.t.js) for more info.
Calling `getLocation` with no parameters will look for a `window` object to pull location info from.  If `window` isn't available (Node.js server) or you need location data for a route you are not currently on, pass the path to match on into `getLocation`.
```js
router.getLocation();
router.getLocation(path);
```

### subscribing to location changes
Callbacks can be registered and un-registered at any time:
```js
router.register(location => console.log(location));
```

### navigating
Use `navigate` to perform an immediate transition to a given url (a string).  Use `navigatorFor` to build a callback bound to a particular path (equivalent to `e => navigate(path, e)`):
```js
router.navigate('/path', e)     // => pass the event if you want it cancelled for you
router.navigatorFor('/path')(e) // => same as above, curried style (useful for event binding)
```

Use `navigateToRoute` to navigate using a route name and params object:
```js
router.navigateToRoute('profile', {profileId: 5}, e);
router.navigatorForRoute('profile', {profileId: 5})(e);
```

This functionality is also available without performing a navigation:
```js
router.pathFor('profile', {profileId: 5}); // => returns '/profiles/5'
```

### es6 module imports
This is safe and convenient:
```js
import {pathFor, navigatorFor} from 'lucid-router';

const link = pathFor('route-name');
const navigator = navigatorFor(link);
```


Note.. I just pushed some code around and added some features which aren't finalized/tested, including the names of these functions.  I'll remove this message next time I push a version to NPM.
