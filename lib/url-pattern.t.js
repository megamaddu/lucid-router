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
  stringify(params: Object): string;
}

declare class RegexToArrayUrlPattern {
  constructor(routePattern: RegExp): void;
  match(pathname: string): ?Array<string>;
  stringify(params: Object): string;
}

declare class RegexToObjectUrlPattern {
  constructor(routePattern: RegExp, keys?: Array<string>): void;
  match(pathname: string): ?Object;
  stringify(params: Object): string;
}

declare module 'url-pattern' {
}
