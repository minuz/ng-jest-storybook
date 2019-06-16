module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup.jest.ts'],
  roots: ['<rootDir>/src', '<rootDir>/projects'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/storybook-static/',
    'angularshots.test.js',
    'dist'
  ],
  modulePaths: ['<rootDir>/dist'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: './coverage/jest-report.html'
      }
    ],
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        output: './coverage/test_results.xml',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true'
      }
    ]
  ]
};
