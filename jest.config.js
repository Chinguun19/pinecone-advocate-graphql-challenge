// Jest configuration
module.exports = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'node',
  rootDir: './',
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  setupFilesAfterEnv: ['<rootDir>/specs/jest-setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/graphql/resolvers/**/*.{js,jsx,ts,tsx}',
    '!**/components/ui/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/out/**',
    '!**/*.d.ts',
    '!**/graphql/resolvers/index.ts',
  ],
  testMatch: ['<rootDir>/specs/**/*.(test|spec).{js,jsx,ts,tsx}'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};