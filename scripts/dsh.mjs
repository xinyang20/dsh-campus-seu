import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { root, run } from './run.mjs';

try {
  const directory = path.join(root, 'node_modules/@deepseek-ai/dsh');
  const project = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
  const expected = project.devDependencies['@deepseek-ai/dsh'];
  if (manifest.version !== expected) throw new Error(`The local DSH runtime must be ${expected}.`);
  if (typeof manifest.bin?.dsh !== 'string') throw new Error('The local DSH package has no dsh executable.');
  // A missing local dependency must never fall back to a global DSH installation.
  process.exitCode = await run(process.execPath, [path.join(directory, manifest.bin.dsh), ...process.argv.slice(2)]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
