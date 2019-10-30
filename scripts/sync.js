const fs = require('fs');
const cp = require('child_process');
const {promisify} = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exec = promisify(cp.exec);

const jestConfig = `const {name} = require('./package.json');

module.exports = {
  ...require('../../jest.config.base.js'),
  displayName: name,
  rootDir: __dirname,
};
`;

const tsConfig = `{
  "compilerOptions": {
    "outDir": "build"
  },
  "extends": "../../tsconfig",
  "include": ["src/**/*"]
}
`;

const tsConfigBuild = `{
  "compilerOptions": {
    "outDir": "build"
  },
  "extends": "../../tsconfig",
  "include": ["src/**/*"],
  "exclude": ["**/*.test.*", "**/*.stories.*"]
}
`;

const packagesDir = `${__dirname}/../packages`;

const readPackageJson = async file => {
  try {
    return JSON.parse(await readFile(file, 'utf-8'));
  } catch (error) {
    return {};
  }
};

const syncPackageJson = async (dir, name) => {
  const file = `${dir}/package.json`;
  const oldConfig = await readPackageJson(file);
  const config = {
    ...oldConfig,
    name: `@spudly/${name}`,
    main: oldConfig.main || `build/${name}.js`,
    version: oldConfig.version || '0.1.0',
    scripts: {
      build: 'rm -rf build && tsc -p tsconfig.build.json',
      prepare: 'npm run build',
      test: 'jest',
    },
    license: 'ISC',
    repository: `https://github.com/spudly/components/tree/master/packages/${name}`,
    files: ['build'],
  };
  await writeFile(file, JSON.stringify(config, null, 2));
};

const syncPackage = async name => {
  const dir = `${packagesDir}/${name}`;
  await exec(`mkdir -p ${dir}/src`);
  await Promise.all([
    syncPackageJson(dir, name),
    writeFile(`${dir}/jest.config.js`, jestConfig),
    writeFile(`${dir}/tsconfig.json`, tsConfig),
    writeFile(`${dir}/tsconfig.build.json`, tsConfigBuild),
  ]);
};

const syncGlobalJestConfig = async names => {
  const file = `${__dirname}/../jest.config.js`;
  await writeFile(
    file,
    `module.exports = ${JSON.stringify(
      {
        projects: names.map(name => `packages/${name}/jest.config.js`),
      },
      null,
      2,
    )};`,
  );
};

const sync = async () => {
  const names = await readdir(packagesDir);
  await Promise.all([...names.map(syncPackage), syncGlobalJestConfig(names)]);
};

sync().then(() => console.log('success!'), error => console.error({error}));
