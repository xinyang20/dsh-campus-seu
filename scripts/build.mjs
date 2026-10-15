import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const result = await build({
  entryPoints: [path.join(root, 'src/client/index.jsx')],
  bundle: true, platform: 'browser', format: 'cjs', target: 'es2022',
  external: ['react'], write: false,
});
await mkdir(path.join(root, 'lib'), { recursive: true });
await writeFile(path.join(root, 'lib/client.js'), `window.__ModuleLoader__.load({id:"dsh-campus-seu",factory:(require)=>{const module={exports:{}};const exports=module.exports;\n${result.outputFiles[0].text}\nreturn module.exports;}});\n`);
console.log('Built dsh-campus-seu client module.');
