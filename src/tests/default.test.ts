const path = require("path");
const { expect } = require("chai");
const { rollup } = require("rollup");
const { terser } = require("rollup-plugin-terser");
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

describe("test: default", () => {
  beforeEach(async () => {
    bundle = await rollup({
      input,
      plugins: [
        terser(),
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
    generated = await bundle.generate({ format: "es" });
    output = generated.output;
  });

  it("css bundle should be injected into the end of the <head> tag by default", async () => {
    let cssBundle: string | Uint8Array = "",
      htmlBundle: string | Uint8Array = "";
    for (let i = 0; i < output.length; i++) {
      let item: OutputChunk | OutputAsset = output[i];
      if (item.fileName === cssBundleName && "source" in item) {
        cssBundle = item.source;
      } else if (item.fileName === htmlFileName && "source" in item) {
        htmlBundle = item.source;
      }
    }
    cssBundle =
      typeof cssBundle === "string"
        ? cssBundle.trim()
        : new TextDecoder("utf-8").decode(cssBundle).trim();
    htmlBundle =
      typeof htmlBundle === "string"
        ? htmlBundle
        : new TextDecoder("utf-8").decode(htmlBundle);
    expect(htmlBundle.match(InjectTag.HEAD_TAG)).to.have.lengthOf(1);
    expect(htmlBundle).to.include("<style>" + cssBundle + "</style></head>");
  });

  it("js bundle should be injected into the end of the <body> tag by default", async () => {
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
    expect(htmlBundle.match(InjectTag.BODY_TAG)).to.have.lengthOf(1);
    expect(htmlBundle).to.include("<script>" + jsBundle + "</script></body>");
  });
});
