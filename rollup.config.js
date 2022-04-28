const babel = require('rollup-plugin-babel');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const external = require('rollup-plugin-peer-deps-external');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');

module.exports = [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
      },
    ],
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react', '@babel/preset-typescript'],
      }),
      external(),
      nodeResolve({
        customResolveOptions: {
          moduleDirectories: ['node_modules'],
        },
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
  },
];
