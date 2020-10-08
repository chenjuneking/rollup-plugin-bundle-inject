// const { colors, symbols } = require("mocha/lib/reporters/base");
// colors.pass = 32;
// symbols.ok = "😀";

module.exports = {
  require: "ts-node/register",
  "watch-files": ["./src/**/*.ts", "./tests/**/*.ts"],
};
