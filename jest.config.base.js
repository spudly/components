const path = require('path');
const fs = require('fs');
const getPackages = require('./scripts/getPackages');

const packages = getPackages();

const moduleNameMapper = packages.reduce((map, pkg) => {
  const {name, mainSrc} = JSON.parse(
    fs.readFileSync(`${__dirname}/${pkg.location}/package.json`),
  );
  return {
    ...map,
    [`^${name}$`]: path.resolve(__dirname, pkg.location, mainSrc),
  };
}, {});

module.exports = {
  transform: {'^.+\\.tsx?$': 'ts-jest'},
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
    '**/*.js',
    '**/*.jsx',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '[.]config[.]js',
    '/coverage/',
    '[.]stories[.]',
  ],
  testPathIgnorePatterns: ['build', '[.]stories[.]'],
  moduleNameMapper,
};
