/**
 * Component Jest configuration
 * 
 * Uses Next.js compilation for component tests.
 * Slower but necessary for React components.
 */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  
  // Only component tests
  testMatch: [
    '**/__tests__/components/**/*.test.[jt]sx',
    '**/__tests__/app/**/*.test.[jt]sx',
  ],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  
  // Timeouts
  testTimeout: 10000, // 10 seconds for component tests
  
  // Performance
  maxWorkers: '50%',
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache-components',
}

module.exports = createJestConfig(customJestConfig)

