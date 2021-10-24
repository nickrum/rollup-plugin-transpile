import { promises as fs } from 'fs';

export async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.stat(path);

    return true;
  } catch {
    return false;
  }
}
