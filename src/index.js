import { fileURLToPath } from 'node:url';
import { ASSET_PREFIX, createAssetHandler } from './assets.js';

export const name = 'dsh-campus-seu';
export const inject = ['webServer', 'connection'];

export function apply(ctx) {
  const directory = fileURLToPath(new URL('../assets/', import.meta.url));
  ctx.effect(() => ctx.webServer.register({
    // The host matches prefix + '/', so the registered prefix must not end with '/'.
    kind: 'prefix', path: ASSET_PREFIX.slice(0, -1),
    handler: createAssetHandler({ directory, admit: req => ctx.connection.admit(req) }),
  }));
}
