import { mkdir, realpath, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { env, root, run } from './run.mjs';

async function main() {
  const buildCode = await run('pnpm', ['run', 'build']);
  if (buildCode !== 0) return buildCode;

  const profileModules = path.join(env.DSH_HOME, 'profiles/web/node_modules');
  const documents = path.join(root, '.runtime/documents');
  await mkdir(profileModules, { recursive: true });
  await mkdir(documents, { recursive: true });
  const link = path.join(profileModules, 'dsh-campus-seu');
  try {
    await symlink(root, link, 'dir');
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    if (await realpath(link) !== await realpath(root)) {
      throw new Error(`The development plugin link points elsewhere: ${link}`);
    }
  }

  const patch = path.join(root, '.runtime/local.patch.yml');
  await writeFile(patch, `- id: workspace-controller\n  config:\n    documentsDirectory: ${JSON.stringify(documents)}\n- insert:\n    - id: dsh-campus-seu\n      name: dsh-campus-seu\n`);
  console.log('Starting the isolated SEU theme at http://127.0.0.1:39395.');
  console.log(`DSH_HOME: ${env.DSH_HOME}`);
  console.log(`Documents: ${documents}`);
  return run(process.execPath, [path.join(root, 'scripts/dsh.mjs'), '--profile', 'web', '--patch', patch, '--host', '127.0.0.1', '--port', '39395', '--no-open']);
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
