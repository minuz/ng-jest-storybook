const baseConfig = require('./jest.base.config');
module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/projects'],
  coverageDirectory: 'coverage/lib'
};
