"use strict";
var UrlPattern = require("url-pattern");
var assign = require("object-assign");
;
;
;
{
    path: string;
    name: string;
    pathname: string;
    search: string;
    hash: string;
    hashSearch: string;
    state: any;
}
;
var hasHistoryApi = (window !== undefined &&
    history !== undefined &&
    typeof history.pushState === "function");
var locationChangeCallbacks = [];
var routes = [];
function addRoutes(newRoutes) {
    if (!(newRoutes instanceof Array))
        throw typeError(routes, "lucid-router expects to be passed a routing array as its first parameter");
    for (var _i = 0, newRoutes_1 = newRoutes; _i < newRoutes_1.length; _i++) {
        var routeSpec = newRoutes_1[_i];
        if (routeSpec === null || !(routeSpec instanceof Object))
            throw typeError(routes, "lucid-router expects each routeSpec definition to be an object");
        routeSpec.path = routeSpec.path || null;
        routeSpec.name = routeSpec.name || null;
        routeSpec.external = typeof routeSpec.external === "function"
            ? routeSpec.external
            : !!routeSpec.external;
        var route = {
            path: routeSpec.path,
            name: routeSpec.name,
            external: routeSpec.external,
            pattern: null
        };
        try {
            route.pattern = new UrlPattern(route.path);
        }
        catch (err) {
            throw typeError(route.path, "lucid-router expects route paths to be a string or regex expression");
        }
        routes.push(route);
    }
}
exports.addRoutes = addRoutes;
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
exports.removeRoute = removeRoute;
function parseQuery(query) {
    var queryArgs = {};
    if (query) {
        query.split("&")
            .filter(function (keyValStr) { return Boolean(keyValStr); })
            .map(function (keyValStr) { return keyValStr.split("=")
            .map(function (encoded) { return decodeURIComponent(encoded); }); })
            .forEach(function (_a) {
            var key = _a[0], val = _a[1];
            if (key)
                queryArgs[key] = val;
        });
    }
    return queryArgs;
}
function match(path) {
    var _a = path.split("#"), pathnameAndQuery = _a[0], hashAndHashQuery = _a[1];
    var _b = pathnameAndQuery.split("?"), pathname = _b[0], search = _b[1];
    var _c = hashAndHashQuery.split("?"), hash = _c[0], hashSearch = _c[1];
    var queryState = parseQuery([search, hashSearch].join("&"));
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var route = routes_1[_i];
        var matchState = route.pattern.match(pathname);
        if (!matchState)
            continue;
        return {
            route: route,
            pathname: pathname,
            search: search ? "?".concat(search) : "",
            hash: hash ? "#".concat(hash) : "",
            hashSearch: hashSearch ? "?".concat(hashSearch) : "",
            state: assign({}, queryState, matchState)
        };
    }
    return null;
}
exports.match = match;
function navigate(path, e, replace) {
    path = getFullPath(path);
    if (hasHistoryApi) {
        if (typeof path !== "string" || !path)
            throw typeError(path, "lucid-router.navigate expected a non empty string as its first parameter");
        var m = match(path);
        if (m && notExternal(m)) {
            var location_1 = matchAndPathToLocation(m, path);
            if (replace) {
                history.replaceState(null, "", path);
            }
            else {
                history.pushState(null, "", path);
            }
            if (e && e.preventDefault instanceof Function) {
                e.preventDefault();
            }
            onLocationChange(location_1);
            return;
        }
    }
    if (window && (e && !e.target)) {
        window.location.href = path;
    }
}
exports.navigate = navigate;
function navigatorFor(path, replace) {
    return function (e) { return navigate(path, e, replace); };
}
exports.navigatorFor = navigatorFor;
function pathFor(routeName, params) {
    for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
        var route = routes_2[_i];
        if (route.name === routeName) {
            return route.pattern.stringify(params);
        }
    }
    throw new Error("lucid-router.pathFor failed to find a route with the name \"" + routeName + "\"");
}
exports.pathFor = pathFor;
function navigateToRoute(routeName, params, e) {
    navigate(pathFor(routeName, params), e);
}
exports.navigateToRoute = navigateToRoute;
function navigatorForRoute(routeName, params) {
    return function (e) { return navigateToRoute(routeName, params, e); };
}
exports.navigatorForRoute = navigatorForRoute;
function register(callback) {
    if (typeof callback !== "function")
        throw typeError(callback, "lucid-router.register expects to be passed a callback function");
    locationChangeCallbacks.push(callback);
    return function unregister() {
        var idx = locationChangeCallbacks.indexOf(callback);
        if (~idx)
            locationChangeCallbacks.splice(idx, 1);
    };
}
exports.register = register;
function onLocationChange(location) {
    locationChangeCallbacks.forEach(function (cb) { return cb(location); });
}
function getFullPath(path) {
    if (window) {
        var a = window.document.createElement("a");
        a.href = path;
        if (!a.host)
            a.href = a.href;
        if (a.hostname === window.location.hostname) {
            path = a.pathname + a.search + a.hash;
            if (path[0] !== "/") {
                path = "/" + path;
            }
        }
        else {
            path = a.href;
        }
    }
    return path;
}
function getWindowPathAndQuery() {
    var location = window.location;
    if (!location)
        return null;
    return location.pathname + location.search + location.hash;
}
function getLocation(path) {
    path = path || getWindowPathAndQuery() || "";
    var m = match(path);
    var location = matchAndPathToLocation(m, path);
    onLocationChange(location);
    return location;
}
exports.getLocation = getLocation;
function matchAndPathToLocation(m, p) {
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
function notExternal(m) {
    var external = m.route.external;
    if (typeof external === "function") {
        return !external(m);
    }
    else
        return !external;
}
if (hasHistoryApi && window) {
    window.addEventListener("popstate", function (e) {
        var path = getWindowPathAndQuery() || "";
        var m = match(path);
        if (m && notExternal(m)) {
            var location_2 = matchAndPathToLocation(m, path);
            onLocationChange(location_2);
        }
    }, false);
}
function typeError(type, msg) {
    return new TypeError(msg + " but got type `" + typeof type + "`!");
}
//# sourceMappingURL=router.js.map