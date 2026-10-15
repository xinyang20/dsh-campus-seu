import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { ASSET_FILES, ASSET_PREFIX, createAssetHandler } from '../src/assets.js';
import { apply } from '../src/index.js';

const DIRECTORY = '/virtual/campus-assets';
const ASSET_BYTES = Buffer.from('bundled asset bytes');
const EXPECTED_ASSETS = [
  ['jiulonghu-library-2020.jpg', 'image/jpeg'],
  ['sipailou-auditorium-2012.jpg', 'image/jpeg'],
  ['seu-emblem-official.png', 'image/png'],
  ['dingdong-rebuilt.png', 'image/png'],
];

function response() {
  return {
    headers: new Map(), headersSent: false, ended: false,
    setHeader(name, value) { this.headers.set(name.toLowerCase(), value); },
    writeHead(status, headers = {}) {
      this.status = status;
      for (const [name, value] of Object.entries(headers)) this.setHeader(name, value);
      this.headersSent = true;
    },
    end(body) { this.body = body; this.ended = true; },
  };
}

function fixture({ admission = {}, readError } = {}) {
  const reads = [];
  const admitted = [];
  const handler = createAssetHandler({
    directory: DIRECTORY,
    admit(req) { admitted.push(req); if (admission instanceof Error) throw admission; return admission; },
    async read(file) { reads.push(file); if (readError) throw readError; return ASSET_BYTES; },
  });
  return {
    reads, admitted,
    async request(url, method = 'GET') {
      const req = { url, method };
      const res = response();
      await handler(req, res);
      assert.equal(res.ended, true);
      return { req, res };
    },
  };
}

test('the plugin registers a host-compatible prefix covering all bundled assets and removes it on cleanup', () => {
  const routes = new Set();
  const cleanups = [];
  apply({
    effect(setup) { const dispose = setup(); cleanups.push(dispose); return dispose; },
    webServer: { register(route) { routes.add(route); return () => routes.delete(route); } },
    connection: { admit: () => ({}) },
  });
  const matchHostRoute = pathname => [...routes].find(route => route.kind === 'prefix'
    && (pathname === route.path || pathname.startsWith(route.path + '/')));
  assert.equal(routes.size, 1);
  for (const file of ASSET_FILES) {
    const matched = matchHostRoute(ASSET_PREFIX + file);
    assert.ok(matched, `host prefix must match ${file}`);
    assert.equal(typeof matched.handler, 'function');
  }
  assert.equal(cleanups.length, 1);
  assert.equal(typeof cleanups[0], 'function');
  cleanups[0]();
  assert.equal(routes.size, 0);
  for (const file of ASSET_FILES) assert.equal(matchHostRoute(ASSET_PREFIX + file), undefined);
});

test('host admission rejects access before method handling or reading a file', async () => {
  for (const status of [401, 403]) {
    const f = fixture({ admission: { rejection: status } });
    const { req, res } = await f.request(ASSET_PREFIX + ASSET_FILES[0], 'POST');
    assert.equal(res.status, status);
    assert.equal(res.body, undefined);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.deepEqual(f.admitted, [req]);
    assert.deepEqual(f.reads, []);
  }
});

test('only GET and HEAD are accepted and unsupported methods cannot read assets', async () => {
  const f = fixture();
  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']) {
    const { res } = await f.request(ASSET_PREFIX + ASSET_FILES[0], method);
    assert.equal(res.status, 405);
    assert.equal(res.headers.get('allow'), 'GET, HEAD');
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal(res.body, undefined);
  }
  assert.deepEqual(f.reads, []);
});

test('the exact asset allowlist prevents unknown files, encoded paths and traversal from reaching disk', async () => {
  const f = fixture();
  for (const url of [
    ASSET_PREFIX,
    `${ASSET_PREFIX}dingdong.png`,
    `${ASSET_PREFIX}../package.json`,
    `${ASSET_PREFIX}%2e%2e/package.json`,
    `${ASSET_PREFIX}%2e%2e%2fpackage.json`,
    `${ASSET_PREFIX}%2F${ASSET_FILES[0]}`,
    `${ASSET_PREFIX}${ASSET_FILES[0]}/extra`,
    `/different/${ASSET_FILES[0]}`,
  ]) {
    const { res } = await f.request(url);
    assert.equal(res.status, 404, url);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal(res.body, undefined);
  }
  assert.deepEqual(f.reads, []);
});

test('each allowed JPEG or PNG asset is read from the configured directory with correct response metadata', async () => {
  assert.deepEqual(ASSET_FILES, EXPECTED_ASSETS.map(([file]) => file));
  const f = fixture();
  for (const [file, mediaType] of EXPECTED_ASSETS) {
    const { res } = await f.request(`${ASSET_PREFIX}${file}?preview=1`);
    assert.equal(res.status, 200);
    assert.equal(res.body, ASSET_BYTES);
    assert.equal(res.headers.get('content-type'), mediaType);
    assert.equal(res.headers.get('content-length'), ASSET_BYTES.length);
    assert.equal(res.headers.get('cache-control'), 'private, max-age=3600');
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  }
  assert.deepEqual(f.reads, ASSET_FILES.map(file => path.join(DIRECTORY, file)));
});

test('HEAD reports JPEG and PNG lengths and media types without returning asset bytes', async () => {
  const f = fixture();
  for (const [file, mediaType] of EXPECTED_ASSETS) {
    const { res } = await f.request(ASSET_PREFIX + file, 'HEAD');
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-length'), ASSET_BYTES.length);
    assert.equal(res.headers.get('content-type'), mediaType);
    assert.equal(res.body, undefined);
  }
  assert.deepEqual(f.reads, EXPECTED_ASSETS.map(([file]) => path.join(DIRECTORY, file)));
});

test('a file read failure is a non-cacheable server error without exposing paths or partial bytes', async () => {
  const failure = Object.assign(new Error(`Missing confidential path ${DIRECTORY}`), { code: 'ENOENT' });
  const f = fixture({ readError: failure });
  for (const method of ['GET', 'HEAD']) {
    const { res } = await f.request(ASSET_PREFIX + ASSET_FILES[0], method);
    assert.equal(res.status, 500);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal(res.body, undefined);
    assert.equal(res.headers.has('content-length'), false);
  }
});

test('an admission failure cannot fall through to asset reading', async () => {
  const f = fixture({ admission: new Error('Admission service unavailable') });
  const { res } = await f.request(ASSET_PREFIX + ASSET_FILES[0]);
  assert.equal(res.status, 500);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.deepEqual(f.reads, []);
});
