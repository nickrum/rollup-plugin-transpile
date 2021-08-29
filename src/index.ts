import path from 'path';

import { Plugin } from 'rollup';
import { createFilter } from '@rollup/pluginutils';
import { transform } from '@swc/core';

import { DEFAULT_OPTIONS, TS_RESOLVE_SUFFIXES } from './constants';
import { pathExists } from './utils';
import { getTsConfig, normalizeTsTarget } from './tsconfig';
import { TranspileOptions } from './types';

export default function transpile(options?: TranspileOptions): Plugin {
  let resolvedOptions: TranspileOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const filter = createFilter(
    resolvedOptions.include ||
      (resolvedOptions.transform === 'ecmascript' ? /\.jsx?$/ : /\.tsx?$/),
    resolvedOptions.exclude
  );

  return {
    name: 'transpile',

    async buildStart() {
      const tsConfig = await getTsConfig();

      const tsOptions = tsConfig.compilerOptions?.target
        ? {
            target: normalizeTsTarget(tsConfig.compilerOptions.target)
          }
        : {};

      resolvedOptions = {
        ...DEFAULT_OPTIONS,
        ...tsOptions,
        ...options
      };
    },

    async resolveId(importee, importer) {
      if (importer && /^[./]/.test(importee)) {
        const resolved = path.resolve(path.dirname(importer), importee);

        for (const suffix of TS_RESOLVE_SUFFIXES) {
          const filename = `${resolved}${suffix}`;

          if (await pathExists(filename)) {
            return filename;
          }
        }
      }

      return null;
    },

    async transform(code, id) {
      if (!filter(id)) return null;

      const ext = path.extname(id).slice(1);

      const jsxOption =
        resolvedOptions.transform === 'ecmascript' && ext === 'jsx'
          ? { jsx: true }
          : ext === 'tsx'
          ? { tsx: true }
          : {};

      const result = await transform(code, {
        filename: id,
        sourceMaps: resolvedOptions.sourceMap,
        jsc: {
          target: resolvedOptions.target,
          parser: {
            syntax: resolvedOptions.transform,
            ...jsxOption
          }
        }
      });

      return {
        code: result.code,
        map: result.map
      };
    }
  };
}
