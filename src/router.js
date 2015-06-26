import Pattern from 'url-pattern';

const window  = global.window;
const history = global.history;

const hasHistoryApi =
  window !== undefined &&
  history !== undefined &&
  typeof history.pushState === 'function';

const locationChangeCallbacks = [];

const onLocationChange = location => locationChangeCallbacks.forEach(cb => cb(location));

const routes = [];

export function addRoutes(newRoutes) {
  if (!(routes instanceof Array)) throw typeError(routes, 'lucid-router expects to be passed a routing array as its first parameter');
  for (let routeIdx in newRoutes) {
    let route = newRoutes[routeIdx];
    if (!(route instanceof Object)) throw typeError(routes, 'lucid-router expects each route definition to be an object');
    route.path = route.path || null;
    route.name = route.name || null;
    route.external = typeof route.external === 'function'
      ? route.external
      : !!route.external;
    try {
      route.pattern = new Pattern(route.path);
    } catch (err) {
      throw typeError(route.path, 'lucid-router expects route paths to be a string or regex expression');
    }
    routes.push(route);
  }
}

export function removeRoute(name) {
  if (!name) return;
  let idx = -1;
  for (let routeIdx in routes) {
    if (routes[routeIdx].name === name) {
      idx = routeIdx;
      break;
    }
  }
  ~idx && routes.splice(idx, 1);
}

export function match(path) {
  const [pathname,query] = path.split('?');
  const queryArgs = {};
  if (query) {
    query.split('&')
      .map(keyValStr => keyValStr.split('=')
        .map(encoded => decodeURIComponent(encoded)))
      .forEach(([key,val]) => queryArgs[key] = val);
  }
  for (let routeIdx in routes) {
    const route = routes[routeIdx];
    const m = route.pattern.match(pathname);
    if (!m) continue;
    Object.keys(m).forEach(key => queryArgs[key] = m[key]);
    return {route, state: queryArgs};
  }
  return null;
}

export function navigate(path, e) {
  if (e && e.defaultPrevented) return;
  if (e && e.preventDefault && e.stopPropagation) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (hasHistoryApi) {
    if (typeof path !== 'string' || !path) throw typeError(path, 'lucid-router.navigate expected a non empty string as its first parameter');
    const m = match(path);
    if (m && notExternal(m)) {
      const location = matchAndPathToLocation(m, path);
      history.pushState(null, '', path);
      onLocationChange(location);
      return;
    }
  }
  if (window) {
    (window.location = path);
  }
}

export function navigatorFor(path) {
  return e => navigate(path, e);
}

export function register(callback) {
  if (typeof callback !== 'function') throw typeError(callback, 'lucid-router.register expects to be passed a callback function');
  locationChangeCallbacks.push(callback);
  return function unregister() {
    const idx = locationChangeCallbacks.indexOf(callback);
    ~idx && locationChangeCallbacks.splice(idx, 1);
  };
}

function getWindowPathAndQuery() {
  const {location} = window;
  if (!location) return null;
  return location.pathname + location.search;
}

export function getLocation(path) {
  path = path || getWindowPathAndQuery();
  const m = match(path);
  const location = matchAndPathToLocation(m, path);
  onLocationChange(location);
  return location;
}

function matchAndPathToLocation(m, p) {
  return !m
    ? null
    : {path: p, name: m.route.name, state: m.state};
}

function notExternal(m) {
  const {external} = m.route;
  if (typeof external === 'function') {
    return !external(m);
  } else return !external;
}

if (hasHistoryApi && window) {
  window.addEventListener('popstate', function(e) {
    const path = getWindowPathAndQuery();
    const m = match(path);
    if (m && notExternal(m)) {
      const location = matchAndPathToLocation(m, path);
      onLocationChange(location);
      return;
    }
  }, false);
}

function typeError(type, msg) {
  return new TypeError(msg + ' but got type `' + typeof type + '`!');
}
