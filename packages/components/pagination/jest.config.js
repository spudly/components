const {name} = require('./package.json');

module.exports = {
  ...require('../../../jest.config.base.js'),
  displayName: name,
  rootDir: __dirname,
};
