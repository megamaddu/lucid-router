declare module "url-pattern" {
  type UrlPatternOptions = {
    escapeChar?: string;
    segmentNameStartChar?: string;
    segmentNameCharset?: string;
    segmentValueCharset?: string;
    optionalSegmentStartChar?: string;
    optionalSegmentEndChar?: string;
    wildcardChar?: string;
  }

  class UrlPattern {
    constructor(routePattern: string, options?: UrlPatternOptions);
    match(pathname: string): Object;
    stringify(params?: Object): string;
  }
  export = UrlPattern;
}
