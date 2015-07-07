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

function parseQuery(query) {
  var queryArgs = {};
  if (query) {
    query.split('&').filter(function (keyValStr) {
      return !!keyValStr;
    }).map(function (keyValStr) {
      return keyValStr.split('=').map(function (encoded) {
        return decodeURIComponent(encoded);
      });
    }).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);

      var key = _ref2[0];
      var val = _ref2[1];
      return key && (queryArgs[key] = val);
    });
  }
  return queryArgs;
}

function match(path) {
  var _path$split = path.split('#');

  var _path$split2 = _slicedToArray(_path$split, 2);

  var pathnameAndQuery = _path$split2[0];
  var hashAndHashQuery = _path$split2[1];

  var _pathnameAndQuery$split = pathnameAndQuery.split('?');

  var _pathnameAndQuery$split2 = _slicedToArray(_pathnameAndQuery$split, 2);

  var pathname = _pathnameAndQuery$split2[0];
  var search = _pathnameAndQuery$split2[1];

  var _ref3 = hashAndHashQuery ? hashAndHashQuery.split('?') : [];

  var _ref32 = _slicedToArray(_ref3, 2);

  var hash = _ref32[0];
  var hashSearch = _ref32[1];

  var state = parseQuery([search, hashSearch].join('&'));

  var _loop = function (routeIdx) {
    var route = routes[routeIdx];
    var m = route.pattern.match(pathname);
    if (!m) return 'continue';
    Object.keys(m).forEach(function (key) {
      return state[key] = m[key];
    });
    return {
      v: {
        route: route,
        pathname: pathname,
        search: search ? '?'.concat(search) : '',
        hash: hash ? '#'.concat(hash) : '',
        hashSearch: hashSearch ? '?'.concat(hashSearch) : '',
        state: state }
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

function navigate(path, e, replace) {
  if (e && e.defaultPrevented) return;
  if (e && e.preventDefault && e.stopPropagation) {
    e.preventDefault();
    e.stopPropagation();
  }
  path = getFullPath(path);
  if (hasHistoryApi) {
    if (typeof path !== 'string' || !path) throw typeError(path, 'lucid-router.navigate expected a non empty string as its first parameter');
    var m = match(path);
    if (m && notExternal(m)) {
      var _location = matchAndPathToLocation(m, path);
      if (replace) {
        history.replaceState(null, '', path);
      } else {
        history.pushState(null, '', path);
      }
      onLocationChange(_location);
      return;
    }
  }
  if (window) {
    window.location = path;
  }
}

function navigatorFor(path, replace) {
  return function (e) {
    return navigate(path, e, replace);
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

function getFullPath(path) {
  if (window) {
    var a = window.document.createElement('a');
    a.href = path;
    if (a.host === window.location.host) {
      path = a.pathname + a.search + a.hash;
    } else {
      path = a.href;
    }
  }
  return path;
}

function getWindowPathAndQuery() {
  var location = window.location;

  if (!location) return null;
  return location.pathname + location.search + location.hash;
}

function getLocation(path) {
  path = path || getWindowPathAndQuery();
  var m = match(path);
  var location = matchAndPathToLocation(m, path);
  onLocationChange(location);
  return location;
}

function matchAndPathToLocation(m, p) {
  return !m ? null : {
    path: p,
    name: m.route.name,
    pathname: m.pathname,
    search: m.search,
    hash: m.hash,
    hashSearch: m.hashSearch,
    state: m.state
  };
}

function notExternal(m) {
  var external = m.route.external;

  if (typeof external === 'function') {
    return !external(m);
  } else return !external;
}

if (hasHistoryApi && window) {
  window.addEventListener('popstate', function (e) {
    var path = getWindowPathAndQuery();
    var m = match(path);
    if (m && notExternal(m)) {
      var _location2 = matchAndPathToLocation(m, path);
      onLocationChange(_location2);
      return;
    }
  }, false);
}

function typeError(type, msg) {
  return new TypeError(msg + ' but got type `' + typeof type + '`!');
}
