const fs = require('fs');
const cp = require('child_process');
const {promisify} = require('util');
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

const tsConfig = `{
  "compilerOptions": {
    "outDir": "build"
  },
  "extends": "../../../tsconfig",
  "include": ["src/**/*"]
}
`;

const tsConfigBuild = `{
  "compilerOptions": {
    "outDir": "build"
  },
  "extends": "../../../tsconfig",
  "include": ["src/**/*"],
  "exclude": ["**/*.test.*", "**/*.stories.*"]
}
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
  console.log(fileName);
  const config = {
    ...oldConfig,
    name: pkg.name,
    main: oldConfig.main || `build/${fileName}.js`,
    mainSrc: oldConfig.mainSrc || `src/${fileName}.ts`,
    version: oldConfig.version || '0.1.0',
    scripts: {
      build: 'rm -rf build && tsc -p tsconfig.build.json',
      prepare: 'npm run build',
      test: 'jest',
    },
    license: 'ISC',
    repository: `https://github.com/spudly/components/tree/master${pkg.location}`,
    files: ['build'],
    sideEffects: false, // enables webpack treeshaking
  };
  await writeFile(configFile, JSON.stringify(config, null, 2));
};

const syncPackage = async pkg => {
  await exec(`mkdir -p ${pkg.location}/src`);
  await Promise.all([
    syncPackageJson(pkg),
    writeFile(`${pkg.location}/jest.config.js`, jestConfig),
    writeFile(`${pkg.location}/tsconfig.json`, tsConfig),
    writeFile(`${pkg.location}/tsconfig.build.json`, tsConfigBuild),
  ]);
};

const syncGlobalJestConfig = async packages => {
  const file = `${__dirname}/../jest.config.js`;
  await writeFile(
    file,
    `module.exports = ${JSON.stringify(
      {
        projects: packages.map(pkg => `${pkg.location}/jest.config.js`),
      },
      null,
      2,
    )};`,
  );
};

const sync = async () => {
  const packages = getPackages();
  await Promise.all([
    ...packages.map(syncPackage),
    syncGlobalJestConfig(packages),
  ]);
};

sync().then(
  () => console.log('success!'),
  error => console.error({error}),
);
