const path = require("path");
const postcss = require("rollup-plugin-postcss");
const bundleInject = require("../dist/index");

module.exports = {
  input: "./src/index.js",
  output: {
    dir: "./public/dist",
    format: "cjs",
  },
  plugins: [
    postcss({
      extract: true,
    }),
    bundleInject({
      target: "./public/index.html",
    }),
  ],
};
