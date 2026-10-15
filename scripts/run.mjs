import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { constants } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const env = {
  ...process.env,
  DSH_HOME: path.join(root, '.runtime/dsh-home'),
  TMPDIR: path.join(root, '.cache/tmp'),
  XDG_CACHE_HOME: path.join(root, '.cache/xdg-cache'),
  XDG_CONFIG_HOME: path.join(root, '.cache/xdg-config'),
  XDG_DATA_HOME: path.join(root, '.cache/xdg-data'),
  XDG_STATE_HOME: path.join(root, '.cache/xdg-state'),
  npm_config_cache: path.join(root, '.cache/npm'),
  npm_config_store_dir: path.join(root, '.cache/pnpm-store'),
  npm_config_cache_dir: path.join(root, '.cache/pnpm-cache'),
  npm_config_state_dir: path.join(root, '.cache/pnpm-state'),
  COREPACK_DEFAULT_TO_LATEST: '0',
};

for (const key of ['DSH_HOME', 'TMPDIR', 'XDG_CACHE_HOME', 'XDG_CONFIG_HOME', 'XDG_DATA_HOME', 'XDG_STATE_HOME']) {
  mkdirSync(env[key], { recursive: true });
}

export function run(command, args = []) {
  // Reuse the pnpm executable that launched this script, including Corepack's cached binary.
  const pnpm = process.env.npm_execpath;
  if (command === 'pnpm' && pnpm && /^pnpm\.(?:c?js|mjs)$/.test(path.basename(pnpm))) {
    args = [pnpm, ...args];
    command = process.execPath;
  }
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: 'inherit' });
    const handlers = new Map(['SIGINT', 'SIGTERM'].map(signal => [signal, () => child.kill(signal)]));
    for (const [signal, handler] of handlers) process.on(signal, handler);
    const cleanup = () => {
      for (const [signal, handler] of handlers) process.off(signal, handler);
    };
    child.once('error', error => { cleanup(); reject(error); });
    child.once('close', (code, signal) => {
      cleanup();
      resolve(code ?? (signal ? 128 + (constants.signals[signal] ?? 1) : 1));
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, ...args] = process.argv.slice(2);
  if (!command) throw new Error('Pass a command to run inside the project environment.');
  try {
    process.exitCode = await run(command, args);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
