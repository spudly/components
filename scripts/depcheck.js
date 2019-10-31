const fs = require('fs');
const cp = require('child_process');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);
const exec = promisify(cp.exec);

const packagesDir = `${__dirname}/../packages`;

const depcheckPkg = async name => {
  console.log(`checking dependencies for ${name}`);
  const header = `\n===================\n${name}\n===================`;
  try {
    await Promise.race([
      exec(`../../node_modules/.bin/depcheck`, {
        cwd: `${packagesDir}/${name}`,
      }),
      new Promise((resolve, reject) =>
        setTimeout(
          () =>
            reject(new Error(`depcheck(${name}) timed out after 30 seconds`)),
          30000,
        ),
      ),
    ]);
    console.log(`${header}\ngood to go`);
  } catch (error) {
    process.exitCode = 1;
    if (error.stdout) {
      console.log(header);
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
    process.exit(1);
  },
);
