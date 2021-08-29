import path from 'path';
import { promises as fs } from 'fs';

import { pathExists } from './utils';
import { TranspileTarget, TsConfig } from './types';

export async function getTsConfig(): Promise<TsConfig> {
  const configPath = path.resolve('tsconfig.json');

  if ((await pathExists(configPath)) && (await fs.stat(configPath)).isFile()) {
    const configContent = await fs.readFile(configPath, 'utf8');

    return JSON.parse(configContent);
  }

  return {};
}

export function normalizeTsTarget(target: string): TranspileTarget {
  const lowerCaseTarget = target.toLowerCase();

  if (lowerCaseTarget === 'es6') return 'es2015';
  if (lowerCaseTarget === 'es7') return 'es2016';

  if (lowerCaseTarget === 'esnext') return 'es2021';

  return lowerCaseTarget as TranspileTarget;
}
