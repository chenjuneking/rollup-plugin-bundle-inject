var path = require("path");
var { expect } = require("chai");
var { rollup } = require("rollup");
var { terser } = require("rollup-plugin-terser");
var bundleInject = require("../dist/rollup-plugin-bundle-inject.cjs.js");
var { getOutputFromGenerated } = require("./helper/utils");

var input = "main.js";
var htmlPath = path.resolve(__dirname, "./fixtures/default.html");
var htmlFileName = path.basename(htmlPath);
var jsCode =
  "const a = 1; const b = 2; function sum(a, b) { return a + b; }; console.log(sum(a, b));";

describe("test: default", () => {
  it("css bundle should be injected into the end of the <head> tag by default", async () => {});

  it("js bundle should be injected into the end of the <body> tag by default", async () => {
    const bundle = await rollup({
      input,
      plugins: [
        bundleInject({
          target: htmlPath,
        }),
        terser(),
        {
          name: "fake-plugin",
          resolveId(id) {
            return id;
          },
          load(importee) {
            if (importee === "main.js") return jsCode;
          },
        },
      ],
    });

    const generated = await bundle.generate({ format: "es" });
    const { output } = generated;
    console.log(222, output);
    let bundleCode, htmlSource;
    for (let i = 0; i < output.length; i++) {
      if (output[i].fileName === input) {
        bundleCode = output[i].code;
      } else if (output[i].fileName === htmlFileName) {
        htmlSource = output[i].source;
      }
    }
    expect(htmlSource).to.include("<script>" + bundleCode + "</script>");
  });
});
