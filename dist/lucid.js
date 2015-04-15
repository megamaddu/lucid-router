'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.addRoutes = addRoutes;
exports.removeRoute = removeRoute;
exports.match = match;
exports.navigate = navigate;
exports.navigatorFor = navigatorFor;
exports.register = register;
exports.getLocation = getLocation;

var _Pattern = require('url-pattern');

var _Pattern2 = _interopRequireWildcard(_Pattern);

var window = global.window;
var history = global.history;

var hasHistoryApi = window !== undefined && history !== undefined && typeof history.pushState === 'function';

var locationChangeCallbacks = [];

var onLocationChange = function onLocationChange(location) {
  return locationChangeCallbacks.forEach(function (cb) {
    return cb(location);
  });
};

var routes = [];

function addRoutes(newRoutes) {
  if (!(routes instanceof Array)) throw typeError(routes, 'lucid-router expects to be passed a routing array as its first parameter');
  for (var routeIdx in newRoutes) {
    var route = newRoutes[routeIdx];
    if (!(route instanceof Object)) throw typeError(routes, 'lucid-router expects each route definition to be an object');
    route.path = route.path || null;
    route.name = route.name || null;
    route.external = !!route.external;
    try {
      route.pattern = new _Pattern2['default'](route.path);
    } catch (err) {
      throw typeError(route.path, 'lucid-router expects route paths to be a string or regex expression');
    }
    routes.push(route);
  }
}

function removeRoute(name) {
  if (!name) {
    return;
  }var idx = -1;
  for (var routeIdx in routes) {
    if (routes[routeIdx].name === name) {
      idx = routeIdx;
      break;
    }
  }
  ~idx && locationChangeCallbacks.splice(idx, 1);
}

function match(path) {
  for (var routeIdx in routes) {
    var route = routes[routeIdx];
    var m = route.pattern.match(path);
    if (m) {
      return { route: route, state: m };
    }
  }
  return null;
}

function navigate(path, e) {
  if (e && e.defaultPrevented) {
    return;
  }if (e && e.preventDefault && e.stopPropagation) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (hasHistoryApi) {
    if (typeof path !== 'string' || !path) throw typeError(path, 'lucid-router.navigate expected a non empty string as its first parameter');
    var m = match(path);
    if (m && !m.route.external) {
      var _location = matchAndPathToLocation(m, path);
      history.pushState({ location: _location }, '', path);
      onLocationChange(_location);
      return;
    }
  }
  if (window) {
    window.location = path;
  }
}

function navigatorFor(path) {
  return function (e) {
    return navigate(path, e);
  };
}

function register(callback) {
  if (typeof callback !== 'function') throw typeError(callback, 'lucid-router expects to be passed a callback function');
  locationChangeCallbacks.push(callback);
  return function unregister() {
    var idx = locationChangeCallbacks.indexOf(callback);
    ~idx && locationChangeCallbacks.splice(idx, 1);
  };
}

function getLocation(path) {
  path = path || window.location.pathname;
  var m = match(path);
  var location = matchAndPathToLocation(m, path);
  onLocationChange(location);
  return location;
}

function matchAndPathToLocation(m, p) {
  return !m ? null : { p: p, name: m.route.name, state: m.state };
}

if (hasHistoryApi && window) {
  window.addEventListener('popstate', function (e) {
    return onLocationChange(e.state && e.state.location);
  }, false);
}

function typeError(type, msg) {
  return new TypeError(msg + ' but got type `' + typeof type + '`!');
}
