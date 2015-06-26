'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.addRoutes = addRoutes;
exports.removeRoute = removeRoute;
exports.match = match;
exports.navigate = navigate;
exports.navigatorFor = navigatorFor;
exports.register = register;
exports.getLocation = getLocation;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _urlPattern = require('url-pattern');

var _urlPattern2 = _interopRequireDefault(_urlPattern);

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
    route.external = typeof route.external === 'function' ? route.external : !!route.external;
    try {
      route.pattern = new _urlPattern2['default'](route.path);
    } catch (err) {
      throw typeError(route.path, 'lucid-router expects route paths to be a string or regex expression');
    }
    routes.push(route);
  }
}

function removeRoute(name) {
  if (!name) return;
  var idx = -1;
  for (var routeIdx in routes) {
    if (routes[routeIdx].name === name) {
      idx = routeIdx;
      break;
    }
  }
  ~idx && routes.splice(idx, 1);
}

function match(path) {
  var _path$split = path.split('?');

  var _path$split2 = _slicedToArray(_path$split, 2);

  var pathname = _path$split2[0];
  var query = _path$split2[1];

  var queryArgs = {};
  if (query) {
    query.split('&').map(function (keyValStr) {
      return keyValStr.split('=').map(function (encoded) {
        return decodeURIComponent(encoded);
      });
    }).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var key = _ref2[0];
      var val = _ref2[1];
      return queryArgs[key] = val;
    });
  }

  var _loop = function (routeIdx) {
    var route = routes[routeIdx];
    var m = route.pattern.match(pathname);
    if (!m) return 'continue';
    Object.keys(m).forEach(function (key) {
      return queryArgs[key] = m[key];
    });
    return {
      v: { route: route, state: queryArgs }
    };
  };

  for (var routeIdx in routes) {
    var _ret = _loop(routeIdx);

    switch (_ret) {
      case 'continue':
        continue;

      default:
        if (typeof _ret === 'object') return _ret.v;
    }
  }
  return null;
}

function navigate(path, e) {
  if (e && e.defaultPrevented) return;
  if (e && e.preventDefault && e.stopPropagation) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (hasHistoryApi) {
    if (typeof path !== 'string' || !path) throw typeError(path, 'lucid-router.navigate expected a non empty string as its first parameter');
    var m = match(path);
    if (m && notExternal(m)) {
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
  if (typeof callback !== 'function') throw typeError(callback, 'lucid-router.register expects to be passed a callback function');
  locationChangeCallbacks.push(callback);
  return function unregister() {
    var idx = locationChangeCallbacks.indexOf(callback);
    ~idx && locationChangeCallbacks.splice(idx, 1);
  };
}

function getWindowPathAndQuery() {
  var location = window.location;

  if (!location) return null;
  return location.pathname + location.search;
}

function getLocation(path) {
  path = path || getWindowPathAndQuery();
  var m = match(path);
  var location = matchAndPathToLocation(m, path);
  onLocationChange(location);
  return location;
}

function matchAndPathToLocation(m, p) {
  return !m ? null : { path: p, name: m.route.name, state: m.state };
}

function notExternal(m) {
  var external = m.route.external;

  if (typeof external === 'function') {
    return !external(m);
  } else return !external;
}

if (hasHistoryApi && window) {
  window.addEventListener('popstate', function (_ref3) {
    var state = _ref3.state;
    return state && state.location && onLocationChange(state.location);
  }, false);
}

function typeError(type, msg) {
  return new TypeError(msg + ' but got type `' + typeof type + '`!');
}
