import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import terser from '@rollup/plugin-terser';

const dev = process.env.ROLLUP_WATCH;

const serveOpts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

export default {
  input: 'src/magic-home-party.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  inlineDynamicImports: true,
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    dev ? serve(serveOpts) : terser(),
  ],
  moduleContext: (moduleId) => {
    const thisAsWindowForModules = [
      'node_modules/@formatjs/intl-utils/lib/src/diff.js',
      'node_modules/@formatjs/intl-utils/lib/src/resolve-locale.js',
    ];
    if (thisAsWindowForModules.some(path => moduleId.trimRight().endsWith(path))) {
      return 'window';
    }
  },
};
