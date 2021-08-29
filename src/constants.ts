import { TranspileOptions } from './types';

export const DEFAULT_OPTIONS: TranspileOptions = {
  transform: 'ecmascript',
  target: 'es2015'
};

export const TS_RESOLVE_SUFFIXES = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
