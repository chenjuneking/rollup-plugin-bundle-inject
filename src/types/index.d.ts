declare module "html-minifier" {
  export function minify(code: string, options: object): string;
}

interface BundleList {
  cssList: Array<string | Uint8Array>;
  jsList: Array<string>;
}
