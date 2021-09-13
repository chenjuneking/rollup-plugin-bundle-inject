const path = require("path");
const { expect } = require("chai");
const { rollup } = require("rollup");
const postcss = require("rollup-plugin-postcss");
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
const htmlRename: string = "index.html";
const jsCode: string =
  'import "./style.css"; const a = 1; const b = 2; function sum(a, b) { return a + b; }; console.log(sum(a, b));';
const cssCode: string =
  '*{padding:0;margin:0;}body{font-size:12px;font-family:"Arial";}ul{list-style:none;}';
const cssBundleName: string = "bundle.css";

describe("test: options.rename", () => {
  it("rename should be working", async () => {
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
          rename: htmlRename,
        }),
      ],
    });
    const generated: RollupOutput = await bundle.generate({ format: "es" });
    const output: [OutputChunk, ...(OutputChunk | OutputAsset)[]] =
      generated.output;
    const existRenamedHTML: boolean = output.some(
      (o) => o.fileName === htmlRename
    );
    const existOriginalHTML: boolean = output.some(
      (o) => o.fileName === htmlFileName
    );
    expect(existRenamedHTML).to.be.true;
    expect(existOriginalHTML).to.be.false;
  });
});
