import dts from 'rollup-plugin-dts';

import transpile from './bootstrap.js';

import pkg from './package.json';

const external = Object.keys(pkg.dependencies).concat(['path', 'fs']);

export default [
  {
    input: 'src/index.ts',
    plugins: [transpile({ transform: 'typescript' })],
    external,
    output: [
      { format: 'cjs', file: pkg.main, exports: 'auto' },
      { format: 'es', file: pkg.module }
    ]
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      file: pkg.types
    }
  }
];
