/**
 * Minimal setup for fast unit tests
 * No DOM, no React, no Next.js - just pure logic testing
 */

// Polyfills only if needed
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Mock environment variables
process.env.NEXT_PUBLIC_EXPERIENCE_START_YEAR = '2021'
process.env.NEXT_PUBLIC_GITHUB_OWNER = 'bolabaden'

// Suppress expected console errors
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('GitHub API error') ||
       args[0].includes('Failed to fetch'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

