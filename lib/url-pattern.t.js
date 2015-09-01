declare class UrlPattern {
  constructor(routePattern: string): void;
  match(pathname: string): Object;
}

declare module 'url-pattern' {
}
