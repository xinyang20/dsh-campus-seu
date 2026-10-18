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
