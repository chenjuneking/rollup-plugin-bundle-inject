import * as fs from "fs";
import * as path from "path";
import { minify } from "html-minifier";
import { isExist, getListFromBundle } from "./utils";
import { InjectTag } from "./constants";

// const fs: any = require("fs");
// const path: any = require("path");
// const minify: any = require("html-minifier").minify;
// const { isExist, getListFromBundle } = require("./utils");
// const { InjectTag } = require("./constants");

interface Options {
  target?: string;
}

const replace = (
  source: string,
  pattern: RegExp,
  replacement: string
): string => {
  return source.replace(pattern, replacement);
};

export default function bundleInject(options: Options): object {
  const target: string = options.target;
  const fileName: string = path.basename(target);

  return {
    name: "rollup-plugin-bundle-inject",
    generateBundle(options: object = {}, bundle: object = {}) {
      // found the target html
      if (fs.statSync(target)) {
        // read the html code
        let code: string = fs.readFileSync(target, { encoding: "utf-8" });
        const { cssList, jsList } = getListFromBundle(bundle);
        const isExistInjectCSSTag: boolean = isExist("inject:css", code);
        const isExistInjectJSTag: boolean = isExist("inject:js", code);
        let pattern: RegExp;
        let replacement: string;
        if (isExistInjectCSSTag) {
          // if exist css tag
          pattern = InjectTag.CSS;
          replacement = cssList.reduce(
            (acc, source) => `${acc}<style>${source}</style>`,
            ""
          );
          code = replace(code, pattern, replacement);
        }
        if (isExistInjectJSTag) {
          // else if exist js tag
          pattern = InjectTag.JS;
          replacement = jsList.reduce(
            (acc, source) => `${acc}<script>${source}</script>`,
            ""
          );
          code = replace(code, pattern, replacement);
        }
        if (!isExistInjectCSSTag && !isExistInjectJSTag) {
          // else default insert into the end of the head / body tag
          const headPattern: RegExp = InjectTag.HEAD_TAG;
          const headReplacement: string = cssList.reduce(
            (acc, source) => `${acc}<style>${source}</style></head>`,
            ""
          );
          const bodyPattern: RegExp = InjectTag.BODY_TAG;
          const bodyReplacement: string = jsList.reduce(
            (acc, source) => `${acc}<style>${source}</style></body>`,
            ""
          );
          code = replace(code, headPattern, headReplacement);
          code = replace(code, bodyPattern, bodyReplacement);
        }
        code = minify(code, {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeEmptyElements: true,
        });
        this.emitFile({
          type: "asset",
          fileName,
          source: code,
        });
      }
    },
  };
}

// module.exports = bundleInject;
