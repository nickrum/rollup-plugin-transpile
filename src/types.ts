import { JscTarget } from '@swc/core';

export type TranspileTarget = JscTarget;

export type TranspileOptions = {
  include?: string | RegExp | string[] | RegExp[];
  exclude?: string | RegExp | string[] | RegExp[];

  transform: 'ecmascript' | 'typescript';
  target?: TranspileTarget;
  sourceMap?: boolean;
};

export type TsConfig = {
  compilerOptions?: {
    target?: string;
  };
};
