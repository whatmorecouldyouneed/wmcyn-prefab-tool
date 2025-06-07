const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // provide the path to your next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// add any custom config to be passed to jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // handle module aliases (if you're using them in your Next.js project)
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 