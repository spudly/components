const fs = require('fs');
const cp = require('child_process');
const {promisify} = require('util');
const path = require('path');
const getPackages = require('./getPackages');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exec = promisify(cp.exec);

const camelCase = s => s.replace(/-(\w)/g, (_, $1) => $1.toUpperCase());

const jestConfig = `const {name} = require('./package.json');

module.exports = {
  ...require('../../../jest.config.base.js'),
  displayName: name,
  rootDir: __dirname,
};
`;

const readPackageJson = async file => {
  try {
    return JSON.parse(await readFile(file, 'utf-8'));
  } catch (error) {
    return {};
  }
};

const syncPackageJson = async pkg => {
  const configFile = `${pkg.location}/package.json`;
  const oldConfig = await readPackageJson(configFile);
  const fileName = camelCase(pkg.name.replace(/^@\w+\//, ''));
  const config = {
    ...oldConfig,
    name: pkg.name,
    main: oldConfig.main || `build/${fileName}.js`,
    mainSrc: oldConfig.mainSrc || `src/${fileName}.ts`,
    version: oldConfig.version || '0.1.0',
    scripts: {
      build: 'tsc -b tsconfig.json',
      prepare: 'npm run build',
      test: 'jest',
    },
    license: 'ISC',
    repository: `https://github.com/spudly/sandbox/tree/master/${pkg.location}`,
    files: ['build'],
    sideEffects: false, // enables webpack treeshaking
  };
  await writeFile(configFile, JSON.stringify(config, null, 2));
};

const syncTypescriptConfig = async (pkg, packages) => {
  const tsConfig = {
    compilerOptions: {
      outDir: 'build',
      composite: true,
      rootDir: 'src',
    },
    extends: '../../../tsconfig',
    include: ['src/**/*'],
    references: pkg.dependencies.map(name => {
      const depPkg = packages.find(p => p.name === name);
      return {path: path.relative(pkg.location, depPkg.location)};
    }),
  };
  await writeFile(
    `${pkg.location}/tsconfig.json`,
    JSON.stringify(tsConfig, null, 2),
  );
};

const syncPackage = async (pkg, index, allPackages) => {
  await exec(`mkdir -p ${pkg.location}/src`);
  await Promise.all([
    syncPackageJson(pkg),
    writeFile(`${pkg.location}/jest.config.js`, jestConfig),
    syncTypescriptConfig(pkg, allPackages),
  ]);
};

const syncGlobalJestConfig = async packages => {
  const file = `${__dirname}/../jest.config.js`;
  await writeFile(
    file,
    `module.exports = ${JSON.stringify(
      {
        collectCoverageFrom: ['**/*.{ts,tsx,js,jsx}', '!**/node_modules/**'],
        projects: packages.map(pkg => `${pkg.location}/jest.config.js`),
      },
      null,
      2,
    )};`,
  );
};

const syncGlobalTypescriptConfig = async packages => {
  const dir = path.resolve(__dirname, '..');
  const file = path.resolve(dir, 'tsconfig.json');
  const config = require(file);
  await writeFile(
    file,
    JSON.stringify(
      {
        ...config,
        references: packages.map(pkg => ({
          path: path.relative(dir, pkg.location),
        })),
      },
      null,
      2,
    ),
  );
};

const sync = async () => {
  const packages = getPackages();
  await Promise.all([
    ...packages.map(syncPackage),
    syncGlobalJestConfig(packages),
    syncGlobalTypescriptConfig(packages),
  ]);
};

sync().then(
  () => console.log('success!'),
  error => console.error({error}),
);
