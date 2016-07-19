'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.addRoutes = addRoutes;
exports.removeRoute = removeRoute;
exports.match = match;
exports.navigate = navigate;
exports.navigatorFor = navigatorFor;
exports.pathFor = pathFor;
exports.navigateToRoute = navigateToRoute;
exports.navigatorForRoute = navigatorForRoute;
exports.register = register;
exports.getLocation = getLocation;

var _urlPattern = require('url-pattern');

var _urlPattern2 = _interopRequireDefault(_urlPattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var window = global.window;
var history = global.history;

var hasHistoryApi = window !== undefined && history !== undefined && typeof history.pushState === 'function';

var locationChangeCallbacks = [];

var routes = [];

function addRoutes(newRoutes) {
  if (!(newRoutes instanceof Array)) throw typeError(routes, 'lucid-router expects to be passed a routing array as its first parameter');
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = newRoutes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var route = _step.value;

      if (route === null || !(route instanceof Object)) throw typeError(routes, 'lucid-router expects each route definition to be an object');
      route.path = route.path || null;
      route.name = route.name || null;
      route.external = typeof route.external === 'function' ? route.external : !!route.external;
      try {
        route.pattern = new _urlPattern2.default(route.path);
      } catch (err) {
        throw typeError(route.path, 'lucid-router expects route paths to be a string or regex expression');
      }
      routes.push(route);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function removeRoute(name) {
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

  var _pathnameAndQuery$spl = pathnameAndQuery.split('?');

  var _pathnameAndQuery$spl2 = _slicedToArray(_pathnameAndQuery$spl, 2);

  var pathname = _pathnameAndQuery$spl2[0];
  var search = _pathnameAndQuery$spl2[1];

  var _ref3 = hashAndHashQuery ? hashAndHashQuery.split('?') : [];

  var _ref4 = _slicedToArray(_ref3, 2);

  var hash = _ref4[0];
  var hashSearch = _ref4[1];

  var queryState = parseQuery([search, hashSearch].join('&'));
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = routes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var route = _step2.value;

      var matchState = route.pattern.match(pathname);
      if (!matchState) continue;
      return {
        route: route,
        pathname: pathname,
        search: search ? '?'.concat(search) : '',
        hash: hash ? '#'.concat(hash) : '',
        hashSearch: hashSearch ? '?'.concat(hashSearch) : '',
        state: _extends({}, queryState, matchState)
      };
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return null;
}

function navigate(path, e, replace) {
  path = getFullPath(path || '');
  if (hasHistoryApi) {
    if (typeof path !== 'string' || !path) throw typeError(path, 'lucid-router.navigate expected a non empty string as its first parameter');
    var m = match(path);
    if (m && notExternal(m)) {
      var location = matchAndPathToLocation(m, path);
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

  if (window) {
    if (!e) window.location = path;else {
      var target = e.target;
      if (!target || target.tagName !== 'A') {
        window.location = path;
      }
    }
  }
}

function navigatorFor(path, replace) {
  return function (e) {
    return navigate(path, e, replace);
  };
}

function pathFor(routeName, params) {
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = routes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var route = _step3.value;

      if (route.name === routeName) {
        return route.pattern.stringify(params);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  throw new Error('lucid-router.pathFor failed to find a route with the name \'' + routeName + '\'');
}

function navigateToRoute(routeName, params, e) {
  navigate(pathFor(routeName, params), e);
}

function navigatorForRoute(routeName, params) {
  return function (e) {
    return navigateToRoute(routeName, params, e);
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

function onLocationChange(location) {
  locationChangeCallbacks.forEach(function (cb) {
    return cb(location);
  });
}

function getFullPath(path) {
  if (window) {
    var a = window.document.createElement('a');
    a.href = path;
    if (!a.host) a.href = a.href; /* IE hack */
    if (a.hostname === window.location.hostname) {
      path = a.pathname + a.search + a.hash;
      if (path[0] !== '/') {
        /* more IE hacks */
        path = '/' + path;
      }
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
  path = path || getWindowPathAndQuery() || '';
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
    state: m.state,
    route: m.route
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
    var path = getWindowPathAndQuery() || '';
    var m = match(path);
    if (m && notExternal(m)) {
      var location = matchAndPathToLocation(m, path);
      onLocationChange(location);
    }
  }, false);
}

function typeError(type, msg) {
  return new TypeError(msg + ' but got type `' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)) + '`!');
}
