import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    { file: pkg.main, format: "cjs", exports: "auto" },
    { file: pkg.module, format: "es" },
  ],
  plugins: [
    commonjs(),
    typescript(),
    terser(),
  ],
};
