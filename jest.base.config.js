module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup.jest.ts'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'cobertura']
};
