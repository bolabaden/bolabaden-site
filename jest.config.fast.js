/**
 * Fast Jest configuration
 * 
 * This config skips Next.js compilation for unit tests, providing 10x+ speedup.
 * Use this for pure logic tests (lib/*, utils/*, etc.)
 */

const nextJest = require('next/jest')

// Create a minimal Next.js jest config without full compilation
const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'node', // Much faster than jsdom for non-component tests
  
  // Only run fast unit tests
  testMatch: [
    '**/__tests__/lib/**/*.test.[jt]s',
    '**/__tests__/utils/**/*.test.[jt]s',
  ],
  
  // Module path aliases (same as Next.js)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Skip setup file for pure unit tests (big speedup)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.fast.js'],
  
  // Faster test execution
  maxWorkers: 2, // Limit to 2 workers for faster startup
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Coverage (optional, can disable for even more speed)
  collectCoverageFrom: [
    'lib/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  
  // Timeouts
  testTimeout: 5000, // 5 second max per test
  
  // Skip transformation for faster tests
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

module.exports = createJestConfig(customJestConfig)

