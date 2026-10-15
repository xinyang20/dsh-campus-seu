import assert from 'node:assert/strict';
import test from 'node:test';
import { installAppearance, PLUGIN_ID } from '../src/client/lifecycle.js';
import { THEME_TOKENS } from '../src/client/tokens.js';
import { createPreferencesStore } from '../src/client/preferences.js';

const SLOT_NAMES = ['sidebar.brand.name', 'conversation.hero.brand.mark'];

function fixture({ enabled = true, failSlot, store } = {}) {
  let snapshot = { enabled, campus: 'jiulonghu', showMotto: true };
  const listeners = new Set();
  const preferences = store ?? {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    update(patch) { snapshot = { ...snapshot, ...patch }; for (const listener of [...listeners]) listener(); },
  };
  const hostTokens = { '--dsw-alias-bg-base': { light: '#fefefe', dark: '#181818' } };
  const layers = new Map([['host-customization', hostTokens]]);
  const originals = new Map(SLOT_NAMES.map(name => [name, { component: () => `original ${name}`, priority: 0 }]));
  const occupants = new Map(originals);
  const calls = [];
  const components = Object.fromEntries(SLOT_NAMES.map(name => [name, () => `campus ${name}`]));
  const ctx = {
    theme: {
      getTheme: () => ({ preference: 'system', active: { colorScheme: 'dark' } }),
      setTheme() { assert.fail('appearance must not change the host theme preference'); },
      overrideTokens(source, tokens) {
        calls.push(['theme-add', source]);
        assert.equal(source, PLUGIN_ID);
        layers.set(source, tokens);
        return () => { calls.push(['theme-remove', source]); layers.delete(source); };
      },
    },
    slots: {
      inject(name, callback) {
        calls.push(['slot-inject', name]);
        const cleanup = callback();
        let disposed = false;
        return () => {
          if (disposed) return;
          disposed = true;
          calls.push(['slot-remove', name]);
          cleanup();
        };
      },
      register(options, component) {
        if (options.name === failSlot) throw new Error('slot registration failed');
        assert.ok(options.priority < originals.get(options.name).priority);
        assert.equal(options.inject().preferences, preferences);
        occupants.set(options.name, { component, priority: options.priority });
        return () => occupants.set(options.name, originals.get(options.name));
      },
    },
  };
  return { preferences, listeners, hostTokens, layers, originals, occupants, calls, components, ctx, setFailSlot(name) { failSlot = name; } };
}

function persistedPreferences(enabled, { refuseRollback = false } = {}) {
  let serialized = JSON.stringify({ enabled });
  const store = createPreferencesStore({
    storage: {
      getItem: () => serialized,
      setItem(_key, value) {
        if (refuseRollback && JSON.parse(value).enabled === false) throw new DOMException('Storage denied', 'SecurityError');
        serialized = value;
      },
      removeItem() { serialized = null; },
    },
    eventTarget: { addEventListener() {}, removeEventListener() {} },
  });
  return { store, read: () => JSON.parse(serialized) };
}

test('enabling adds a reversible layer and disabling restores prior host tokens and slot occupants', () => {
  const f = fixture();
  const dispose = installAppearance(f.ctx, f.preferences, f.components);
  assert.equal(f.layers.get(PLUGIN_ID), THEME_TOKENS);
  for (const name of SLOT_NAMES) assert.equal(f.occupants.get(name).component, f.components[name]);
  assert.equal(f.listeners.size, 1);
  assert.equal(f.ctx.theme.getTheme().preference, 'system');
  f.preferences.update({ enabled: false });
  assert.deepEqual([...f.layers.entries()], [['host-customization', f.hostTokens]]);
  assert.deepEqual(f.occupants, f.originals);
  assert.deepEqual(f.calls.slice(-3), [
    ['slot-remove', SLOT_NAMES[1]],
    ['slot-remove', SLOT_NAMES[0]],
    ['theme-remove', PLUGIN_ID],
  ]);
  f.preferences.update({ enabled: true });
  assert.equal(f.layers.get(PLUGIN_ID), THEME_TOKENS);
  assert.equal(f.calls.filter(([name]) => name === 'theme-add').length, 2);
  dispose();
  assert.equal(f.listeners.size, 0);
  assert.deepEqual(f.occupants, f.originals);
  assert.equal(f.layers.has(PLUGIN_ID), false);
  const callsAfterDispose = f.calls.length;
  dispose();
  f.preferences.update({ enabled: false });
  f.preferences.update({ enabled: true });
  assert.equal(f.calls.length, callsAfterDispose);
});

test('an initially disabled theme makes no theme or slot registration until enabled', () => {
  const f = fixture({ enabled: false });
  const dispose = installAppearance(f.ctx, f.preferences, f.components);
  assert.deepEqual(f.calls, []);
  assert.deepEqual(f.occupants, f.originals);
  f.preferences.update({ campus: 'sipailou', showMotto: false });
  assert.deepEqual(f.calls, []);
  f.preferences.update({ enabled: true });
  assert.equal(f.layers.has(PLUGIN_ID), true);
  assert.equal(f.calls.filter(([name]) => name === 'slot-inject').length, SLOT_NAMES.length);
  dispose();
});

test('decorations follow theme activation and are removed on disable, registration failure and disposal', () => {
  const f = fixture({ enabled: false });
  let decorated = false;
  let installs = 0;
  let cleanups = 0;
  const dispose = installAppearance(f.ctx, f.preferences, f.components, {
    installDecorations() {
      assert.equal(f.layers.has(PLUGIN_ID), true, 'tokens must be active before decorations');
      decorated = true;
      installs += 1;
      return () => {
        decorated = false;
        cleanups += 1;
      };
    },
  });
  assert.equal(installs, 0);
  f.preferences.update({ enabled: true });
  assert.equal(decorated, true);
  assert.equal(installs, 1);
  f.preferences.update({ campus: 'sipailou' });
  assert.equal(installs, 1);
  f.preferences.update({ enabled: false });
  assert.equal(decorated, false);
  assert.equal(cleanups, 1);

  f.setFailSlot(SLOT_NAMES[1]);
  f.preferences.update({ enabled: true });
  assert.equal(installs, 2);
  assert.equal(decorated, false);
  assert.equal(cleanups, 2);
  assert.equal(f.preferences.getSnapshot().enabled, false);
  assert.equal(f.layers.has(PLUGIN_ID), false);

  f.setFailSlot(undefined);
  f.preferences.update({ enabled: true });
  assert.equal(decorated, true);
  assert.equal(installs, 3);
  dispose();
  assert.equal(decorated, false);
  assert.equal(cleanups, 3);
  dispose();
  assert.equal(cleanups, 3);
});

test('unrelated preferences do not replace active layers or repeat slot registrations', () => {
  const f = fixture();
  const dispose = installAppearance(f.ctx, f.preferences, f.components);
  const before = [...f.calls];
  f.preferences.update({ campus: 'sipailou' });
  f.preferences.update({ showHero: false, showMotto: false, mascotEnabled: true });
  f.preferences.update({ enabled: true });
  assert.deepEqual(f.calls, before);
  assert.equal(f.layers.get(PLUGIN_ID), THEME_TOKENS);
  dispose();
});

test('initial setup failure restores earlier slots, persists disabled and keeps the settings store usable', () => {
  const persistence = persistedPreferences(true);
  const f = fixture({ failSlot: SLOT_NAMES[1], store: persistence.store });
  const errors = [];
  let ready = 0;
  const dispose = installAppearance(f.ctx, f.preferences, f.components, { onError: error => errors.push(error), onReady: () => { ready += 1; } });
  assert.deepEqual(f.occupants, f.originals);
  assert.deepEqual([...f.layers.entries()], [['host-customization', f.hostTokens]]);
  assert.equal(f.preferences.getSnapshot().enabled, false);
  assert.equal(persistence.read().enabled, false);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /slot registration failed/);
  assert.match(errors[0].message, /主题外观已关闭/);
  assert.equal(ready, 0);
  assert.deepEqual(f.calls.slice(-2), [['slot-remove', SLOT_NAMES[0]], ['theme-remove', PLUGIN_ID]]);
  f.setFailSlot(undefined);
  f.preferences.update({ enabled: true });
  assert.equal(f.layers.has(PLUGIN_ID), true);
  assert.equal(persistence.read().enabled, true);
  assert.equal(ready, 1);
  dispose();
  persistence.store.dispose();
});

test('enabling failure does not interrupt later preference subscribers and can be retried', () => {
  const persistence = persistedPreferences(false);
  const f = fixture({ failSlot: SLOT_NAMES[1], store: persistence.store });
  let status = '';
  const dispose = installAppearance(f.ctx, f.preferences, f.components, { onError: error => { status = error.message; }, onReady: () => { status = ''; } });
  const seen = [];
  f.preferences.subscribe(() => seen.push(f.preferences.getSnapshot().enabled));
  assert.doesNotThrow(() => f.preferences.update({ enabled: true }));
  assert.ok(seen.length > 0);
  assert.ok(seen.every(enabled => enabled === false));
  assert.equal(persistence.read().enabled, false);
  assert.equal(f.layers.has(PLUGIN_ID), false);
  assert.match(status, /启用失败/);
  f.setFailSlot(undefined);
  f.preferences.update({ enabled: true });
  assert.equal(f.layers.has(PLUGIN_ID), true);
  assert.equal(seen.at(-1), true);
  assert.equal(status, '');
  dispose();
  persistence.store.dispose();
});

test('failed preference rollback is reported while appearance stays off and later subscribers still run', () => {
  const persistence = persistedPreferences(false, { refuseRollback: true });
  const f = fixture({ failSlot: SLOT_NAMES[1], store: persistence.store });
  const errors = [];
  const dispose = installAppearance(f.ctx, f.preferences, f.components, { onError: error => errors.push(error) });
  let notifications = 0;
  f.preferences.subscribe(() => { notifications += 1; });
  assert.doesNotThrow(() => f.preferences.update({ enabled: true }));
  assert.equal(notifications, 1);
  assert.equal(persistence.read().enabled, true);
  assert.equal(f.preferences.getSnapshot().enabled, true);
  assert.equal(f.layers.has(PLUGIN_ID), false);
  assert.deepEqual(f.occupants, f.originals);
  assert.equal(errors.length, 1);
  assert.match(errors[0].message, /关闭状态未能保存/);
  assert.match(errors[0].message, /浏览器拒绝访问本地存储/);
  dispose();
  persistence.store.dispose();
});

test('all theme overrides provide both schemes and preserve semantic error, warning and success tokens', () => {
  for (const [name, modes] of Object.entries(THEME_TOKENS)) {
    assert.equal(typeof modes.light, 'string', `${name} needs light mode`);
    assert.equal(typeof modes.dark, 'string', `${name} needs dark mode`);
    assert.ok(modes.light.trim() && modes.dark.trim(), `${name} cannot be blank`);
    assert.doesNotMatch(name, /--dsw-alias-state-(?:error|warn|success)-/);
  }
});
