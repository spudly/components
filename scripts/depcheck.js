const fs = require('fs');
const cp = require('child_process');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);
const exec = promisify(cp.exec);

const packagesDir = `${__dirname}/../packages`;

const depcheckPkg = async name => {
  try {
    await exec(`../../node_modules/.bin/depcheck`, {
      cwd: `${packagesDir}/${name}`,
    });
  } catch (error) {
    process.exitCode = 1;
    if (error.stdout) {
      console.log(`
===================
${name}
===================
`);
      console.log(error.stdout);
      return;
    }
    throw error;
  }
};

const depcheckAll = async () => {
  const names = await readdir(packagesDir);
  await Promise.all(names.map(depcheckPkg));
};

depcheckAll().then(
  () => console.log('success!'),
  error => {
    process.exitCode = 1;
    console.error({error});
  },
);
