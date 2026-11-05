import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env, root } from './run.mjs';

const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const runtimeDirectory = path.join(root, 'node_modules/@deepseek-ai/dsh');
const runtime = JSON.parse(await readFile(path.join(runtimeDirectory, 'package.json'), 'utf8'));
assert.equal(runtime.version, manifest.devDependencies['@deepseek-ai/dsh']);
const cli = path.join(runtimeDirectory, runtime.bin.dsh);
let archive = path.resolve(root, process.argv[2] ?? `.runtime/dist/${manifest.name}-${manifest.version}.tgz`);
if ((await stat(archive)).isDirectory()) archive = path.join(archive, `${manifest.name}-${manifest.version}.tgz`);
await access(archive);
await mkdir(path.join(root, '.runtime/package-check'), { recursive: true });
const directory = await mkdtemp(path.join(root, '.runtime/package-check/run-'));
const environment = { ...env, DSH_HOME: path.join(directory, 'home') };
const profile = 'package-check';
const redact = value => value.replace(/token=[^\s]+/g, 'token=[REDACTED]').slice(-12000);

async function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd: root, env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    const capture = bytes => { output = (output + bytes).slice(-65536); };
    child.stdout.on('data', capture);
    child.stderr.on('data', capture);
    const timeout = setTimeout(() => child.kill('SIGTERM'), 120000);
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('close', code => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(`DSH package operation failed (${code}): ${redact(output)}`));
    });
  });
}

await run(['--profile', profile, '--from-default-profile', 'web', '--dump-config']);
await run(['plugin', '--profile', profile, 'add', archive, '--ignore-scripts']);
const profileDirectory = path.join(environment.DSH_HOME, 'profiles', profile);
const installedDirectory = path.join(profileDirectory, 'node_modules', manifest.name);
const installed = JSON.parse(await readFile(path.join(installedDirectory, 'package.json'), 'utf8'));
assert.equal(installed.version, manifest.version);
await access(path.join(installedDirectory, installed.exports['./client']));
assert.equal(await access(path.join(profileDirectory, 'compatibility.json')).then(() => true, () => false), false);
const documents = path.join(directory, 'documents');
await mkdir(documents, { recursive: true });
const patch = path.join(directory, 'runtime.patch.yml');
await writeFile(patch, `- id: workspace-controller\n  config:\n    documentsDirectory: ${JSON.stringify(documents)}\n`);

const child = spawn(process.execPath, [cli, '--profile', profile, '--patch', patch, '--host', '127.0.0.1', '--port', '0', '--no-open'], {
  cwd: root, env: environment, stdio: ['ignore', 'pipe', 'pipe'],
});
const closed = new Promise(resolve => child.once('close', resolve));
let output = '';
try {
  const url = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`DSH startup timed out: ${redact(output)}`)), 45000);
    const capture = bytes => {
      output = (output + bytes).slice(-65536);
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+\/\?token=[^\s]+/);
      if (match) { clearTimeout(timeout); resolve(match[0]); }
    };
    child.stdout.on('data', capture);
    child.stderr.on('data', capture);
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('close', code => { clearTimeout(timeout); reject(new Error(`DSH exited (${code}): ${redact(output)}`)); });
  });
  const authentication = await fetch(url, { redirect: 'manual' });
  assert.equal(authentication.status, 303);
  const cookie = authentication.headers.get('set-cookie')?.split(';')[0];
  assert.ok(cookie);
  const origin = new URL(url).origin;
  const index = await fetch(origin, { headers: { cookie } });
  assert.equal(index.status, 200);
  assert.match(await index.text(), /dsh-campus-seu/);
  const assets = ['jiulonghu-library-2020.jpg', 'sipailou-auditorium-2012.jpg', 'seu-emblem-official.png', 'dingdong-rebuilt.png'];
  for (const name of assets) {
    const target = `${origin}/dsh-campus-seu/assets/${name}`;
    assert.equal((await fetch(target)).status, 401);
    const response = await fetch(target, { headers: { cookie } });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), name.endsWith('.jpg') ? 'image/jpeg' : 'image/png');
    assert.equal((await response.arrayBuffer()).byteLength, (await stat(path.join(installedDirectory, 'assets', name))).size);
  }
  console.log(JSON.stringify({ runtime: runtime.version, package: installed.version, installed: true, exemption: false, clientDiscovered: true, authenticatedAssets: assets.length }));
} finally {
  child.kill('SIGTERM');
  const timeout = setTimeout(() => child.kill('SIGKILL'), 5000);
  await closed;
  clearTimeout(timeout);
}
