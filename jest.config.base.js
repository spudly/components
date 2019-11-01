const path = require('path');
const fs = require('fs');

const packagesDir = `${__dirname}/packages`;
const dirs = fs.readdirSync(packagesDir);

const moduleNameMapper = dirs.reduce((map, dir) => {
  const pkgDir = `${packagesDir}/${dir}`;
  const {name, mainSrc} = JSON.parse(fs.readFileSync(`${pkgDir}/package.json`));
  return {...map, [`^${name}$`]: path.resolve(pkgDir, mainSrc)};
}, {});

module.exports = {
  transform: {'^.+\\.tsx?$': 'ts-jest'},
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleNameMapper,
};
