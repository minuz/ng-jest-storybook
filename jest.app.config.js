const baseConfig = require('./jest.base.config');
module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src', '<rootDir>/projects'],
  modulePaths: ['<rootDir>/dist'],
  coverageDirectory: 'coverage'
};
