import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { root, run } from './run.mjs';

try {
  const directory = path.join(root, 'node_modules/@deepseek-ai/dsh');
  const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
  if (manifest.version !== '0.2.0-rc.2') throw new Error('The local DSH runtime must be 0.2.0-rc.2.');
  if (typeof manifest.bin?.dsh !== 'string') throw new Error('The local DSH package has no dsh executable.');
  // A missing local dependency must never fall back to a global DSH installation.
  process.exitCode = await run(process.execPath, [path.join(directory, manifest.bin.dsh), ...process.argv.slice(2)]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
