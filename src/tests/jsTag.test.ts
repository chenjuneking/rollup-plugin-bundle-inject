const path = require("path");
const { expect } = require("chai");
const { rollup } = require("rollup");
const postcss = require("rollup-plugin-postcss");
import { InjectTag } from "../constants";
import {
  OutputAsset,
  OutputChunk,
  RollupBuild,
  RollupOutput,
} from "../types/rollup";
const bundleInject = require("../../dist/index");

const input: string = "main.js";
const htmlPath: string = path.resolve(__dirname, "./fixtures/js-tag.html");
const htmlFileName: string = path.basename(htmlPath);
const jsCode: string =
  'import "./style.css"; const a = 1; const b = 2; function sum(a, b) { return a + b; }; console.log(sum(a, b));';
const cssCode: string =
  '*{padding:0;margin:0;}body{font-size:12px;font-family:"Arial";}ul{list-style:none;}';
const cssBundleName: string = "bundle.css";

describe("test: jsTag", () => {
  it("js bundle should be injected into the position where the <!-- inject:js --> tag exists", async () => {
    const bundle: RollupBuild = await rollup({
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
        }),
      ],
    });
    const generated: RollupOutput = await bundle.generate({ format: "es" });
    const output: [OutputChunk, ...(OutputChunk | OutputAsset)[]] =
      generated.output;

    let jsBundle: string = "",
      htmlBundle: string | Uint8Array = "";
    for (let i = 0; i < output.length; i++) {
      let item: OutputChunk | OutputAsset = output[i];
      if (item.fileName === input && "code" in item) {
        jsBundle = item.code;
      } else if (item.fileName === htmlFileName && "source" in item) {
        htmlBundle = item.source;
      }
    }
    jsBundle = jsBundle.trim();
    htmlBundle =
      typeof htmlBundle === "string"
        ? htmlBundle
        : new TextDecoder("utf-8").decode(htmlBundle);
    expect(htmlBundle.match(InjectTag.JS)).to.be.null;
    expect(htmlBundle).to.include(
      "<body><script>" + jsBundle + "</script><h1>"
    );
  });
});
