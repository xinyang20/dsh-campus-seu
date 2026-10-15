import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_PREFERENCES, MAX_MASCOT_BYTES, createPreferencesStore, normalizePreferences, validateMascotDataUrl } from '../src/client/preferences.js';

const KEY = 'dsh-campus-seu.preferences.v1';
const PNG_HEADER = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const png = size => `data:image/png;base64,${Buffer.concat([PNG_HEADER, Buffer.alloc(size - PNG_HEADER.length)]).toString('base64')}`;
const image = png(32);

function fixture(initial = null) {
  const values = new Map(initial === null ? [] : [[KEY, initial]]);
  values.set('host-theme', 'system');
  const writes = [];
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem(key, value) { writes.push(['set', key, value]); values.set(key, value); },
    removeItem(key) { writes.push(['remove', key]); values.delete(key); },
  };
  const handlers = new Set();
  const eventTarget = {
    addEventListener(type, listener) { assert.equal(type, 'storage'); handlers.add(listener); },
    removeEventListener(type, listener) { assert.equal(type, 'storage'); handlers.delete(listener); },
    dispatch(event) { for (const listener of [...handlers]) listener(event); },
  };
  const store = createPreferencesStore({ storage, eventTarget });
  return { values, writes, storage, handlers, eventTarget, store };
}

test('damaged or wrongly shaped persisted values safely restore defaults without writing', () => {
  for (const raw of ['{broken', 'null', '[]', '42', '"dark"']) {
    const { store, writes } = fixture(raw);
    assert.deepEqual(store.getSnapshot(), DEFAULT_PREFERENCES);
    assert.equal(store.getSnapshot(), store.getSnapshot());
    assert.ok(Object.isFrozen(store.getSnapshot()));
    assert.deepEqual(writes, []);
    store.dispose();
  }
  const { store, writes } = fixture(JSON.stringify({ enabled: false, campus: 'unknown', showHero: 'false', mascotEnabled: true, mascotDataUrl: 'https://example.com/pet.svg', hostTheme: 'dark' }));
  assert.deepEqual(store.getSnapshot(), { ...DEFAULT_PREFERENCES, enabled: false });
  assert.deepEqual(writes, []);
  assert.deepEqual(normalizePreferences({ ...DEFAULT_PREFERENCES, campus: 'sipailou', showMotto: false }), { ...DEFAULT_PREFERENCES, campus: 'sipailou', showMotto: false });
  store.dispose();
});

test('allowed raster formats accept valid headers, including the exact decoded-size boundary', () => {
  assert.equal(validateMascotDataUrl(image), image);
  const jpeg = 'data:image/jpeg;base64,/9j/AA==';
  const webp = `data:image/webp;base64,${Buffer.from('RIFF\x04\x00\x00\x00WEBP', 'binary').toString('base64')}`;
  assert.equal(validateMascotDataUrl(jpeg), jpeg);
  assert.equal(validateMascotDataUrl(webp), webp);
  assert.equal(validateMascotDataUrl(null), null);
  const maximum = png(MAX_MASCOT_BYTES);
  assert.equal(validateMascotDataUrl(maximum), maximum);
  assert.throws(() => validateMascotDataUrl(png(MAX_MASCOT_BYTES + 1)), /512 KiB/);
});

test('SVG, remote URLs, malformed base64 and misleading MIME types are rejected before writes', () => {
  const { store, writes } = fixture();
  const before = store.getSnapshot();
  const invalid = [
    'data:image/svg+xml;base64,PHN2Zy8+',
    'https://example.com/pet.png',
    'http://example.com/pet.jpg',
    'data:image/png;base64,not base64',
    'data:image/png;base64,',
    'data:image/png;base64,AAAA===',
    `data:image/png;base64,${Buffer.from('<svg/>').toString('base64')}`,
    png(MAX_MASCOT_BYTES + 1),
  ];
  for (const mascotDataUrl of invalid) {
    assert.throws(() => validateMascotDataUrl(mascotDataUrl));
    assert.throws(() => store.update({ mascotDataUrl, mascotEnabled: true }));
    assert.equal(store.getSnapshot(), before);
    const persisted = fixture(JSON.stringify({ mascotDataUrl, mascotEnabled: true }));
    assert.equal(persisted.store.getSnapshot().mascotDataUrl, null);
    assert.equal(persisted.store.getSnapshot().mascotEnabled, false);
    assert.deepEqual(persisted.writes, []);
    persisted.store.dispose();
  }
  assert.deepEqual(writes, []);
  store.dispose();
});

test('successful updates persist only the plugin key before notifying and preserve stable snapshots', () => {
  const { store, storage, values, writes } = fixture();
  let notifications = 0;
  const off = store.subscribe(() => {
    notifications += 1;
    assert.deepEqual(JSON.parse(storage.getItem(KEY)), store.getSnapshot());
  });
  const changed = store.update({ campus: 'sipailou', showMotto: false, mascotDataUrl: image, mascotEnabled: true, unexpected: 'ignored' });
  assert.equal(changed.campus, 'sipailou');
  assert.equal(changed.mascotEnabled, true);
  assert.equal(changed.unexpected, undefined);
  assert.equal(store.getSnapshot(), changed);
  store.update({ campus: 'sipailou' });
  assert.equal(store.getSnapshot(), changed);
  assert.equal(notifications, 1);
  assert.equal(values.get('host-theme'), 'system');
  assert.ok(writes.every(([, key]) => key === KEY));
  off();
  store.update({ mascotDataUrl: null });
  assert.equal(store.getSnapshot().mascotEnabled, true);
  assert.equal(notifications, 1);
  store.dispose();
});

test('the bundled mascot can be enabled and restored without an upload, while valid user images remain usable', () => {
  const { store, storage } = fixture();
  assert.equal(store.getSnapshot().mascotEnabled, false);
  assert.equal(store.getSnapshot().mascotDataUrl, null);
  store.update({ mascotEnabled: true });
  assert.equal(store.getSnapshot().mascotEnabled, true);
  assert.equal(store.getSnapshot().mascotDataUrl, null);
  const restored = fixture(storage.getItem(KEY));
  assert.equal(restored.store.getSnapshot().mascotEnabled, true);
  assert.equal(restored.store.getSnapshot().mascotDataUrl, null);

  const legacy = fixture(JSON.stringify({ mascotEnabled: true, mascotDataUrl: image }));
  assert.equal(legacy.store.getSnapshot().mascotDataUrl, image);
  assert.equal(legacy.store.getSnapshot().mascotEnabled, true);
  legacy.store.update({ mascotDataUrl: null });
  assert.equal(legacy.store.getSnapshot().mascotDataUrl, null);
  assert.equal(legacy.store.getSnapshot().mascotEnabled, true);
  assert.deepEqual(JSON.parse(legacy.storage.getItem(KEY)), legacy.store.getSnapshot());
  legacy.store.update({ mascotEnabled: false });
  assert.equal(legacy.store.getSnapshot().mascotEnabled, false);
  assert.equal(legacy.store.getSnapshot().mascotDataUrl, null);
  store.dispose();
  restored.store.dispose();
  legacy.store.dispose();
});

test('quota failures and denied storage do not publish or change the existing snapshot', () => {
  const { store, storage, values } = fixture(JSON.stringify({ ...DEFAULT_PREFERENCES, campus: 'sipailou' }));
  const before = store.getSnapshot();
  const serialized = values.get(KEY);
  let notifications = 0;
  store.subscribe(() => { notifications += 1; });
  storage.setItem = () => { throw new DOMException('Quota full', 'QuotaExceededError'); };
  assert.throws(() => store.update({ campus: 'jiulonghu' }), /本地存储空间不足/);
  assert.equal(store.getSnapshot(), before);
  assert.equal(values.get(KEY), serialized);
  assert.equal(notifications, 0);
  storage.removeItem = () => { throw new DOMException('Denied', 'SecurityError'); };
  assert.throws(() => store.reset(), /浏览器拒绝访问本地存储/);
  assert.equal(store.getSnapshot(), before);
  assert.equal(notifications, 0);
  store.dispose();
  const blocked = createPreferencesStore({ storage: null });
  assert.deepEqual(blocked.getSnapshot(), DEFAULT_PREFERENCES);
  assert.throws(() => blocked.update({ enabled: false }), /浏览器拒绝访问本地存储/);
  blocked.dispose();
});

test('storage events sync the plugin key and clear events without rewriting storage', () => {
  const { store, storage, eventTarget, writes } = fixture();
  let notifications = 0;
  store.subscribe(() => { notifications += 1; });
  const next = JSON.stringify({ ...DEFAULT_PREFERENCES, campus: 'sipailou', showHero: false });
  eventTarget.dispatch({ key: 'host-theme', newValue: next, storageArea: storage });
  eventTarget.dispatch({ key: KEY, newValue: next, storageArea: {} });
  assert.equal(notifications, 0);
  eventTarget.dispatch({ key: KEY, newValue: next, storageArea: storage });
  assert.equal(store.getSnapshot().campus, 'sipailou');
  assert.equal(store.getSnapshot().showHero, false);
  eventTarget.dispatch({ key: KEY, newValue: next, storageArea: storage });
  assert.equal(notifications, 1);
  eventTarget.dispatch({ key: KEY, newValue: '{broken', storageArea: storage });
  assert.deepEqual(store.getSnapshot(), DEFAULT_PREFERENCES);
  eventTarget.dispatch({ key: KEY, newValue: next, storageArea: storage });
  eventTarget.dispatch({ key: KEY, newValue: null, storageArea: storage });
  assert.deepEqual(store.getSnapshot(), DEFAULT_PREFERENCES);
  eventTarget.dispatch({ key: KEY, newValue: next, storageArea: storage });
  eventTarget.dispatch({ key: null, newValue: null, storageArea: storage });
  assert.deepEqual(store.getSnapshot(), DEFAULT_PREFERENCES);
  assert.equal(notifications, 6);
  assert.deepEqual(writes, []);
  store.dispose();
});

test('reset removes only the plugin key and dispose releases listeners and rejects stale writes', () => {
  const { store, values, storage, eventTarget, handlers, writes } = fixture(JSON.stringify({ ...DEFAULT_PREFERENCES, enabled: false }));
  let notifications = 0;
  store.subscribe(() => { notifications += 1; });
  assert.equal(handlers.size, 1);
  store.reset();
  assert.deepEqual(store.getSnapshot(), DEFAULT_PREFERENCES);
  assert.equal(values.has(KEY), false);
  assert.equal(values.get('host-theme'), 'system');
  assert.equal(notifications, 1);
  const before = store.getSnapshot();
  store.dispose();
  store.dispose();
  assert.equal(handlers.size, 0);
  eventTarget.dispatch({ key: KEY, newValue: '{"enabled":false}', storageArea: storage });
  assert.equal(store.getSnapshot(), before);
  assert.throws(() => store.update({ enabled: false }), /已关闭/);
  assert.throws(() => store.reset(), /已关闭/);
  assert.deepEqual(writes, [['remove', KEY]]);
  assert.equal(notifications, 1);
});
