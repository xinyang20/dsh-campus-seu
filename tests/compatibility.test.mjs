import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
// Use the same compatibility gate as the installed DSH, including prerelease handling.
const require = createRequire(import.meta.resolve('@deepseek-ai/dsh/package.json'));
const { evaluatePluginCompatibility, getDshRuntimeVersion } = await import(pathToFileURL(require.resolve('@deepseek-ai/dsh-app-boot')).href);

test('the release manifest passes the installed DSH compatibility gate without exemptions', () => {
  assert.equal(getDshRuntimeVersion(), manifest.devDependencies['@deepseek-ai/dsh']);
  assert.equal(evaluatePluginCompatibility(manifest), undefined);
});

for (const runtimeVersion of ['0.2.1-rc.2', '0.2.1-rc.3', '0.2.1']) {
  test(`the declared support range admits ${runtimeVersion} through both engines and peers`, () => {
    assert.equal(evaluatePluginCompatibility(manifest, {}, runtimeVersion), undefined);
    const peerManifest = { ...manifest, engines: { node: manifest.engines.node } };
    assert.equal(evaluatePluginCompatibility(peerManifest, {}, runtimeVersion), undefined);
  });
}

for (const runtimeVersion of ['0.2.0-rc.2', '0.2.1-rc.1', '0.2.2-alpha.1', '0.2.2', '0.3.0']) {
  test(`the declared support range rejects ${runtimeVersion} without exemptions`, () => {
    const issue = evaluatePluginCompatibility(manifest, {}, runtimeVersion);
    assert.ok(issue);
    assert.equal(issue.exempted, false);
    const peerManifest = { ...manifest, engines: { node: manifest.engines.node } };
    assert.ok(evaluatePluginCompatibility(peerManifest, {}, runtimeVersion));
  });
}

test('the DSH gate reproduces v0.3.1 being rejected on rc.3', () => {
  const legacy = {
    name: manifest.name,
    version: '0.3.1',
    peerDependencies: {
      '@deepseek-ai/dsh-host-webserver': '0.2.1-rc.2',
      '@deepseek-ai/dsh-client-connection': '0.2.1-rc.2',
    },
  };
  const issue = evaluatePluginCompatibility(legacy, {}, '0.2.1-rc.3');
  assert.ok(issue);
  assert.deepEqual(issue.requirements, legacy.peerDependencies);
  assert.equal(issue.exempted, false);
});

test('the DSH gate reproduces the incompatible v0.3.0 host requirements', () => {
  const legacy = {
    name: manifest.name,
    version: '0.3.0',
    peerDependencies: {
      '@deepseek-ai/dsh-host-webserver': '0.2.0-rc.2',
      '@deepseek-ai/dsh-client-connection': '0.2.0-rc.2',
    },
  };
  const issue = evaluatePluginCompatibility(legacy);
  assert.ok(issue);
  assert.deepEqual(issue.requirements, legacy.peerDependencies);
  assert.equal(issue.exempted, false);
});
