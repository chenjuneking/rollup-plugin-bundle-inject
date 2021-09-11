const path = require("path");
const { expect } = require("chai");
const { rollup } = require("rollup");
const postcss = require("rollup-plugin-postcss");
import { minify } from "html-minifier";
import {
  OutputAsset,
  OutputChunk,
  RollupBuild,
  RollupOutput,
} from "../types/rollup";
const bundleInject = require("../../dist/index");

const input: string = "main.js";
const htmlPath: string = path.resolve(__dirname, "./fixtures/default.html");
const htmlFileName: string = path.basename(htmlPath);
const jsCode: string =
  'import "./style.css"; const a = 1; const b = 2; function sum(a, b) { return a + b; }; console.log(sum(a, b));';
const cssCode: string =
  '*{padding:0;margin:0;}body{font-size:12px;font-family:"Arial";}ul{list-style:none;}';
const cssBundleName: string = "bundle.css";

let bundle: RollupBuild;
let generated: RollupOutput;
let output: [OutputChunk, ...(OutputChunk | OutputAsset)[]];

describe("test: minifierDisabled", () => {
  beforeEach(async () => {
    bundle = await rollup({
      input,
      plugins: [
        postcss({
          extract: true,
        }),
        {
          name: "fake-plugin",
          resolveId(source: string) {
            return source;
          },
          load(id: string) {
            if (id === "./style.css") {
              this.emitFile({
                type: "asset",
                fileName: cssBundleName,
                source: cssCode,
              });
              return cssCode;
            }
            if (id === "main.js") return jsCode;
            return null;
          },
        },
        bundleInject({
          target: htmlPath,
          minify: false,
        }),
      ],
    });
    generated = await bundle.generate({ format: "es" });
    output = generated.output;
  });

  it("html bundle should not be minified", async () => {
    let htmlBundle: string | Uint8Array = "";
    for (let i = 0; i < output.length; i++) {
      let item: OutputChunk | OutputAsset = output[i];
      if (item.fileName === htmlFileName && "source" in item) {
        htmlBundle = item.source;
      }
    }
    htmlBundle =
      typeof htmlBundle === "string"
        ? htmlBundle
        : new TextDecoder("utf-8").decode(htmlBundle);
    expect(htmlBundle).to.not.equal(
      minify(htmlBundle, {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeEmptyElements: true,
      })
    );
  });
});
