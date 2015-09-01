declare function NavigationCallback(e: Event): void;
declare function RouteMatchCallback(match: RouterMatch): boolean;
declare function UnregisterLocationChangeCallback(): void;

type RouteSpec = {
  name: string,
  path: string,
  external?: boolean | RouteMatchCallback
};
type Route = {
  name: string,
  path: string,
  external?: boolean | RouteMatchCallback,
  pattern: UrlPattern
};
type RouterMatch = {
  route: Route,
  pathname: string,
  search: string,
  hash: string,
  hashSearch: string,
  state: Object
};
type RouterLocation = {
  path: string,
  name: string,
  pathname: string,
  search: string,
  hash: string,
  hashSearch: string,
  state: Object
};

declare function LocationChangeCallback(location?: RouterLocation): void;
