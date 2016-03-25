/* @flow */

import UrlPattern from 'url-pattern';

var window: any  = global.window;
var history: History = global.history;

var hasHistoryApi: boolean = (
  window !== undefined &&
  history !== undefined &&
  typeof history.pushState === 'function'
);

var locationChangeCallbacks: Array<NavigationCallback> = [];

var routes: Array<Route> = [];

export function addRoutes(newRoutes: ?Array<RouteSpec>): void {
  if (!(newRoutes instanceof Array)) throw typeError(routes, 'lucid-router expects to be passed a routing array as its first parameter');
  for (var route of newRoutes) {
    if (route === null || !(route instanceof Object)) throw typeError(routes, 'lucid-router expects each route definition to be an object');
    route.path = route.path || null;
    route.name = route.name || null;
    route.external = typeof route.external === 'function'
      ? route.external
      : !!route.external;
    try {
      route.pattern = new UrlPattern(route.path);
    } catch (err) {
      throw typeError(route.path, 'lucid-router expects route paths to be a string or regex expression');
    }
    routes.push(route);
  }
}

export function removeRoute(name: string): void {
  var idx = -1;
  for (var i = 0, l = routes.length; i < l; i++) {
    if (routes[i].name === name) {
      idx = i;
      break;
    }
  }
  ~idx && routes.splice(idx, 1);
}

function parseQuery(query) {
  var queryArgs = {};
  if (query) {
    query.split('&')
      .filter(keyValStr => !!keyValStr)
      .map(keyValStr => keyValStr.split('=')
        .map(encoded => decodeURIComponent(encoded)))
      .forEach(([key,val]) => key && (queryArgs[key] = val));
  }
  return queryArgs;
}

export function match(path: string): ?RouterMatch {
  var [pathnameAndQuery,hashAndHashQuery] = path.split('#');
  var [pathname,search] = pathnameAndQuery.split('?');
  var [hash,hashSearch] = hashAndHashQuery
    ? hashAndHashQuery.split('?')
    : [];
  var queryState = parseQuery([search,hashSearch].join('&'));
  for (var route of routes) {
    var matchState = route.pattern.match(pathname);
    if (!matchState) continue;
    return {
      route,
      pathname,
      search: search ? '?'.concat(search) : '',
      hash: hash ? '#'.concat(hash) : '',
      hashSearch: hashSearch ? '?'.concat(hashSearch) : '',
      state: {...queryState, ...matchState}
    };
  }
  return null;
}

export function navigate(path: string, e?: Event, replace?: boolean): void {
  path = getFullPath(path);
  if (hasHistoryApi) {
    if (typeof path !== 'string' || !path) throw typeError(path, 'lucid-router.navigate expected a non empty string as its first parameter');
    var m = match(path);
    if (m && notExternal(m)) {
      var location: ?RouterLocation = matchAndPathToLocation(m, path);
      if (replace) {
        history.replaceState(null, '', path);
      } else {
        history.pushState(null, '', path);
      }

      if (e && e.preventDefault) {
        e.preventDefault();
      }

      onLocationChange(location);
      return;
    }
  }

  if (window && (!e || !e.target || !e.target.tagName !== 'A')) {
    window.location = path;
  }
}

export function navigatorFor(path: string, replace?: bool): NavigationCallback {
  return e => navigate(path, e, replace);
}

export function pathFor(routeName: string, params?: Object): string {
  for (var route of routes) {
    if (route.name === routeName) {
      return route.pattern.stringify(params);
    }
  }
  throw new Error(`lucid-router.pathFor failed to find a route with the name '${routeName}'`);
}

export function navigateToRoute(routeName: string, params?: Object, e?: Event): void {
  navigate(pathFor(routeName, params), e);
}

export function navigatorForRoute(routeName: string, params?: Object): NavigationCallback {
  return e => navigateToRoute(routeName, params, e);
}

export function register(callback: RouteMatchCallback): UnregisterLocationChangeCallback {
  if (typeof callback !== 'function') throw typeError(callback, 'lucid-router.register expects to be passed a callback function');
  locationChangeCallbacks.push(callback);
  return function unregister() {
    var idx = locationChangeCallbacks.indexOf(callback);
    ~idx && locationChangeCallbacks.splice(idx, 1);
  };
}

function onLocationChange(location: ?RouterLocation): void {
  locationChangeCallbacks.forEach(cb => cb(location));
}

function getFullPath(path: string): string {
  if (window) {
    var a: HTMLAnchorElement = window.document.createElement('a');
    a.href = path;
    if (!a.host) a.href = a.href; /* IE hack */
    if (a.hostname === window.location.hostname) {
      path = a.pathname + a.search + a.hash;
      if (path[0] !== '/') { /* more IE hacks */
        path = '/' + path;
      }
    } else {
      path = a.href;
    }
  }
  return path;
}

function getWindowPathAndQuery(): ?string {
  var {location} = window;
  if (!location) return null;
  return location.pathname + location.search + location.hash;
}

export function getLocation(path: ?string): ?RouterLocation {
  path = path || getWindowPathAndQuery() || '';
  var m: ?RouterMatch = match(path);
  var location = matchAndPathToLocation(m, path);
  onLocationChange(location);
  return location;
}

function matchAndPathToLocation(m: ?RouterMatch, p: string): ?RouterLocation {
  return !m
    ? null
    : {
      path: p,
      name: m.route.name,
      pathname: m.pathname,
      search: m.search,
      hash: m.hash,
      hashSearch: m.hashSearch,
      state: m.state
    };
}

function notExternal(m: RouterMatch): boolean {
  var {external} = m.route;
  if (typeof external === 'function') {
    return !external(m);
  } else return !external;
}

if (hasHistoryApi && window) {
  window.addEventListener('popstate', function(e: Event) {
    var path = getWindowPathAndQuery() || '';
    var m: ?RouterMatch = match(path);
    if (m && notExternal(m)) {
      var location = matchAndPathToLocation(m, path);
      onLocationChange(location);
    }
  }, false);
}

function typeError(type: any, msg: string): TypeError {
  return new TypeError(msg + ' but got type `' + typeof type + '`!');
}
