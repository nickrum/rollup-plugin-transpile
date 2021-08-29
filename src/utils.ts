import { promises as fs } from 'fs';

export async function pathExists(path: string): Promise<boolean> {
  try {
    fs.stat(path);

    return true;
  } catch {
    return false;
  }
}
