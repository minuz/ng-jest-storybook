module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        require.resolve('jest-preset-angular/InlineHtmlStripStylesTransformer')
      ]
    }
  },
  setupFilesAfterEnv: ['<rootDir>/setup.jest.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/storybook-static/',
    'angularshots.test.js',
    'dist'
  ],
  modulePaths: ['<rootDir>/dist'],
  roots: ['<rootDir>/src', '<rootDir>/projects'],
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
