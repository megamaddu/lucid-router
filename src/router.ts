import UrlPattern = require("url-pattern");
import assign = require("object-assign");

interface RouterMatch {
  route: Route;
  pathname: string;
  search: string;
  hash: string;
  hashSearch: string;
  state: any;
};

interface RouteSpec {
  name: string;
  path: string;
  external?: boolean | ((m: RouterMatch) => boolean);
};

interface Route {
  name: string;
  path: string;
  external?: boolean | ((m: RouterMatch) => boolean);
  pattern: UrlPattern;
};

interface RouterLocation {
  path: string;
  name: string;
  pathname: string;
  search: string;
  hash: string;
  hashSearch: string;
  state: any;
};

const hasHistoryApi: boolean = (
  window !== undefined &&
  history !== undefined &&
  typeof history.pushState === "function"
);

const locationChangeCallbacks: Array<(r: RouterLocation) => void> = [];

const routes: Array<Route> = [];

export function addRoutes(newRoutes: Array<RouteSpec>): void {
  if (!(newRoutes instanceof Array)) throw typeError(routes, "lucid-router expects to be passed a routing array as its first parameter");
  for (let routeSpec of newRoutes) {
    if (routeSpec === null || !(routeSpec instanceof Object)) throw typeError(routes, "lucid-router expects each routeSpec definition to be an object");
    routeSpec.path = routeSpec.path || null;
    routeSpec.name = routeSpec.name || null;
    routeSpec.external = typeof routeSpec.external === "function"
      ? routeSpec.external
      : !!routeSpec.external;
    const route: Route = {
      path: routeSpec.path,
      name: routeSpec.name,
      external: routeSpec.external,
      pattern: null
    };
    try {
      route.pattern = new UrlPattern(route.path);
    } catch (err) {
      throw typeError(route.path, "lucid-router expects route paths to be a string or regex expression");
    }
    routes.push(route);
  }
}

export function removeRoute(name: string): void {
  let idx = -1;
  for (let i = 0, l = routes.length; i < l; i++) {
    if (routes[i].name === name) {
      idx = i;
      break;
    }
  }
  ~idx && routes.splice(idx, 1);
}

interface QueryArgs {
  [index: string]: string;
}

function parseQuery(query: string): QueryArgs {
  const queryArgs: QueryArgs = {};
  if (query) {
    query.split("&")
      .filter((keyValStr: string) => Boolean(keyValStr))
      .map((keyValStr: string) => keyValStr.split("=")
        .map((encoded: string) => decodeURIComponent(encoded))
      )
      .forEach(([key, val]) => {
        if (key)
          queryArgs[key] = val;
      });
  }
  return queryArgs;
}

export function match(path: string): RouterMatch {
  const [pathnameAndQuery, hashAndHashQuery] = path.split("#");
  const [pathname, search] = pathnameAndQuery.split("?");
  const [hash, hashSearch] = hashAndHashQuery.split("?");
  const queryState = parseQuery([search, hashSearch].join("&"));
  for (let route of routes) {
    const matchState = route.pattern.match(pathname);
    if (!matchState) continue;
    return {
      route,
      pathname,
      search: search ? "?".concat(search) : "",
      hash: hash ? "#".concat(hash) : "",
      hashSearch: hashSearch ? "?".concat(hashSearch) : "",
      state: assign({}, queryState, matchState)
    };
  }
  return null;
}

export function navigate(path: string, e?: Event, replace?: boolean): void {
  path = getFullPath(path);
  if (hasHistoryApi) {
    if (typeof path !== "string" || !path) throw typeError(path, "lucid-router.navigate expected a non empty string as its first parameter");
    const m = match(path);
    if (m && notExternal(m)) {
      const location: RouterLocation = matchAndPathToLocation(m, path);
      if (replace) {
        history.replaceState(null, "", path);
      } else {
        history.pushState(null, "", path);
      }

      if (e && e.preventDefault instanceof Function) {
        e.preventDefault();
      }

      onLocationChange(location);
      return;
    }
  }

  if (window && (e && !e.target)) {
    window.location.href = path;
  }
}

export function navigatorFor(path: string, replace?: boolean): ((e: Event) => void) {
  return (e: Event) => navigate(path, e, replace);
}

export function pathFor(routeName: string, params?: Object): string {
  for (let route of routes) {
    if (route.name === routeName) {
      return route.pattern.stringify(params);
    }
  }
  throw new Error(`lucid-router.pathFor failed to find a route with the name "${routeName}"`);
}

export function navigateToRoute(routeName: string, params?: Object, e?: Event): void {
  navigate(pathFor(routeName, params), e);
}

export function navigatorForRoute(routeName: string, params?: Object): ((e: Event) => void) {
  return (e: Event) => navigateToRoute(routeName, params, e);
}

export function register(callback: ((r: RouterLocation) => void)): (() => void) {
  if (typeof callback !== "function") throw typeError(callback, "lucid-router.register expects to be passed a callback function");
  locationChangeCallbacks.push(callback);
  return function unregister() {
    const idx = locationChangeCallbacks.indexOf(callback);
    if (~idx) locationChangeCallbacks.splice(idx, 1);
  };
}

function onLocationChange(location: RouterLocation): void {
  locationChangeCallbacks.forEach(cb => cb(location));
}

function getFullPath(path: string): string {
  if (window) {
    const a: HTMLAnchorElement = window.document.createElement("a");
    a.href = path;
    if (!a.host) a.href = a.href; /* IE hack */
    if (a.hostname === window.location.hostname) {
      path = a.pathname + a.search + a.hash;
      if (path[0] !== "/") { /* more IE hacks */
        path = "/" + path;
      }
    } else {
      path = a.href;
    }
  }
  return path;
}

function getWindowPathAndQuery(): string {
  const {location} = window;
  if (!location) return null;
  return location.pathname + location.search + location.hash;
}

export function getLocation(path: string): RouterLocation {
  path = path || getWindowPathAndQuery() || "";
  const m: RouterMatch = match(path);
  const location = matchAndPathToLocation(m, path);
  onLocationChange(location);
  return location;
}

function matchAndPathToLocation(m: RouterMatch, p: string): RouterLocation {
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
  const {external} = m.route;
  if (typeof external === "function") {
    return !external(m);
  } else return !external;
}

if (hasHistoryApi && window) {
  window.addEventListener("popstate", function(e: Event) {
    const path = getWindowPathAndQuery() || "";
    const m: RouterMatch = match(path);
    if (m && notExternal(m)) {
      const location = matchAndPathToLocation(m, path);
      onLocationChange(location);
    }
  }, false);
}

function typeError(type: any, msg: string): TypeError {
  return new TypeError(msg + " but got type `" + typeof type + "`!");
}
