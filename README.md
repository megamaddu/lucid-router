# lucid-router

Simple (lucid) html5 history-aware router.  Extracted from (and now being used by) a production React app for both client and server routing (gotta get that isomorphic buzz word in there).

Thanks to `url-pattern` for all of the route/pattern work!

## Configuration
Require the router anywhere it will be used and add routes.  Routes are stored inside the `lucid-router` module, so it is safe to destructure or pass the router's functions around without any binding (see below).
```js
import router from 'lucid-router';

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

## Subscribing to location changes
Callbacks can be registered and un-registered at any time:
```js
router.register(location => console.log(location));
```

## Navigating
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

## ES2015 module imports
This is safe and convenient:
```js
import {pathFor, navigatorFor} from 'lucid-router';

const link = pathFor('route-name');
const navigator = navigatorFor(link);
```

## React
Nothing about `lucid-router` is specific to React, but they make a great pair!  I've included a helper component for building anchor tags which you can import and use like so:
```js
import Link from 'lucid-router/link';

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to="my-route" params={id: 9}>My Route</Link>
        <Link href="/somewhere/else">Somewhere else</Link>
      </nav>
    );
  }
}
```
The first becomes an `<a>` with an `href` and `onClick` which defer to `pathFor` and `navigatorForRoute`.  The second just sets the `href` with the value provided and calls `navigate` when clicked.  `Link` is just a shortcut for the most common use cases, so you can use it, ignore it, or make your own!
