const getPackages = require('./getPackages');
const depcheck = require('depcheck');
const path = require('path');
const chalk = require('chalk');

const depcheckPkg = async ({name, location}) => {
  const header = `\n=============================\n${name}\n=============================`;
  let timeoutId;
  const {
    dependencies,
    devDependencies,
    missing,
    using,
    invalidFiles,
    invalidDirs,
  } = await Promise.race([
    new Promise(resolve =>
      depcheck(
        path.resolve(__dirname, '..', location),
        {
          ignoreDirs: [
            // folder with these names will be ignored
            'build',
            'coverage',
            'node_modules',
          ],
          // parsers: {
          //   // the target parsers
          //   '*.js': depcheck.parser.es6,
          //   '*.jsx': depcheck.parser.jsx,
          // },
          specials: [
            // the target special parsers
            depcheck.special.bin,
            depcheck.special.eslint,
            depcheck.special.webpack,
            depcheck.special.jest,
          ],
        },
        resolve,
      ),
    ),
    new Promise((resolve, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error(`depcheck(${name}) timed out after 30 seconds`)),
        30000,
      );
    }),
  ]);
  clearTimeout(timeoutId);
  console.log(header);
  if (Object.keys(using).length) {
    console.log(chalk.green('Using:', '\n ', Object.keys(using).join('\n  ')));
  }
  if (
    dependencies.length ||
    devDependencies.length ||
    missing.length ||
    invalidFiles.length ||
    invalidDirs.length
  ) {
    process.exitCode = 1;
    if (dependencies.length) {
      console.log(
        chalk.red('Unused Dependencies:', '\n ', dependencies.join('\n  ')),
      );
    }
    if (devDependencies.length) {
      console.log(
        chalk.red(
          'Unused Dev Dependencies:',
          '\n ',
          devDependencies.join('\n  '),
        ),
      );
    }
    if (missing.length) {
      console.log(
        chalk.red('Missing Dependencies:', '\n ', missing.join('\n  ')),
      );
    }
    if (invalidFiles.length) {
      console.log(
        chalk.red('Invalid Files:', '\n ', invalidFiles.join('\n  ')),
      );
    }
    if (invalidDirs.length) {
      console.log(chalk.red('Invalid Dirs:', '\n ', invalidDirs.join('\n  ')));
    }
  }
};

const depcheckAll = async () => {
  const packages = getPackages();
  await Promise.all(packages.map(depcheckPkg));
};

depcheckAll().then(
  () => {
    if (!process.exitCode) {
      console.log(chalk.green('\n\nsuccess!'));
    }
  },
  error => {
    process.exitCode = 1;
    console.error(error.stack);
  },
);
