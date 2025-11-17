/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json' },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-preset-angular|@angular|ng2-charts|chart.js|@testing-library|dom-accessibility-api|lodash-es)/)'
  ],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'cjs, html', 'json'],
  testEnvironment: 'jsdom'
};
