import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';

import config from "./rollup.config"

export default {
  ...config,
  output: {
    ...config.output,
    dir: 'cypress/serve/dist',
  },
  plugins: [
    typescript({outDir: "./cypress/serve/dist"}),
    resolve(),
    commonjs(),
  ],
}
