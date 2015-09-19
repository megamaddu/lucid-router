type UrlPatternOptions = {
  escapeChar?: string;
  segmentNameStartChar?: string;
  segmentNameCharset?: string;
  segmentValueCharset?: string;
  optionalSegmentStartChar?: string;
  optionalSegmentEndChar?: string;
  wildcardChar?: string;
}

declare class UrlPattern {
  constructor(routePattern: string, options?: UrlPatternOptions): void;
  match(pathname: string): ?Object;
  stringify(params?: ?Object): string;
}

declare module 'url-pattern' {
  declare var exports: typeof UrlPattern;
}

// declare class RegexToArrayUrlPattern {
//   constructor(routePattern: RegExp): void;
//   match(pathname: string): ?Array<string>;
//   stringify(params: Object): string;
// }
//
// declare class RegexToObjectUrlPattern {
//   constructor(routePattern: RegExp, keys?: Array<string>): void;
//   match(pathname: string): ?Object;
//   stringify(params: Object): string;
// }

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
