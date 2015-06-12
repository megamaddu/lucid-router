import Pattern from 'url-pattern';

const window  = global.window;
const history = global.history;

const hasHistoryApi =
  window !== undefined &&
  history !== undefined &&
  typeof history.pushState === 'function';

const locationChangeCallbacks = [];

const onLocationChange = location => locationChangeCallbacks.forEach((cb) => cb(location));

const routes = [];

export function addRoutes(newRoutes) {
  if (!(routes instanceof Array)) throw typeError(routes, 'lucid-router expects to be passed a routing array as its first parameter');
  for (let routeIdx in newRoutes) {
    let route = newRoutes[routeIdx];
    if (!(route instanceof Object)) throw typeError(routes, 'lucid-router expects each route definition to be an object');
    route.path = route.path || null;
    route.name = route.name || null;
    route.external = !!route.external;
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
  ~idx && locationChangeCallbacks.splice(idx, 1);
}

export function match(path) {
  for (let routeIdx in routes) {
    const route = routes[routeIdx];
    const m = route.pattern.match(path);
    if (m) return {route, state: m};
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
    if (m && !m.route.external) {
      const location = matchAndPathToLocation(m, path);
      history.pushState({location}, '', path);
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
  if (typeof callback !== 'function') throw typeError(callback, 'lucid-router expects to be passed a callback function');
  locationChangeCallbacks.push(callback);
  return function unregister() {
    const idx = locationChangeCallbacks.indexOf(callback);
    ~idx && locationChangeCallbacks.splice(idx, 1);
  };
}

export function getLocation(path) {
  path = path || window.location.pathname;
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

if (hasHistoryApi && window) {
  window.addEventListener(
    'popstate',
    e => onLocationChange(e.state && e.state.location),
    false);
}

function typeError(type, msg) {
  return new TypeError(msg + ' but got type `' + typeof type + '`!');
}