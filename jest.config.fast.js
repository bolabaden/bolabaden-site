/**
 * Fast Jest configuration
 * 
 * This config skips Next.js compilation for unit tests, providing 10x+ speedup.
 * Use this for pure logic tests (lib/*, utils/*, etc.)
 */

module.exports = {
  preset: 'ts-jest',
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
  
  // Transform TypeScript files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  
  // Faster test execution
  maxWorkers: '50%', // Use half CPU cores
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
}

