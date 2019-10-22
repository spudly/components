module.exports = {
  transform: {'^.+\\.tsx?$': 'ts-jest'},
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
