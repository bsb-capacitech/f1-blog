module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDIr>/setup-jest.ts'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json' },
    ],
  },
};
