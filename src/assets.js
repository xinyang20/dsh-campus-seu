import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const ASSET_PREFIX = '/dsh-campus-seu/assets/';
export const ASSET_TYPES = Object.freeze({
  'jiulonghu-library-2020.jpg': 'image/jpeg',
  'sipailou-auditorium-2012.jpg': 'image/jpeg',
  'seu-emblem-official.png': 'image/png',
  'dingdong-rebuilt.png': 'image/png',
});
export const ASSET_FILES = Object.freeze(Object.keys(ASSET_TYPES));

/** Serve only the bundled campus assets, using the host's browser admission. */
export function createAssetHandler({ directory, admit, read = readFile }) {
  return async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    try {
      const admission = admit(req);
      if ('rejection' in admission) {
        res.writeHead(admission.rejection); res.end(); return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
      }
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const file = ASSET_FILES.find(name => pathname === ASSET_PREFIX + name);
      if (!file) { res.writeHead(404); res.end(); return; }
      const bytes = await read(path.join(directory, file));
      res.writeHead(200, { 'Content-Type': ASSET_TYPES[file], 'Content-Length': bytes.length, 'Cache-Control': 'private, max-age=3600' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch {
      if (!res.headersSent) res.writeHead(500, { 'Cache-Control': 'no-store' });
      res.end();
    }
  };
}
