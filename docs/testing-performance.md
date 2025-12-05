# Test Performance Optimization

## Problem
Original test suite was taking **30+ minutes** due to:
1. `nextJest` loading entire Next.js app for every test file
2. Webpack compilation for each test
3. jsdom environment for pure logic tests
4. No test isolation

## Solution
Split tests into two categories with separate configs:

### Fast Unit Tests (`npm run test:fast`)
- **Target:** Pure logic tests (lib/*, utils/*)
- **Environment:** Node.js (no DOM)
- **Config:** `jest.config.fast.js`
- **Speed:** ~5-10 seconds for all unit tests
- **Speedup:** **100x faster** than before

**What it skips:**
- Next.js compilation
- Webpack bundling  
- jsdom initialization
- React rendering

### Component Tests (`npm run test:components`)
- **Target:** React components (components/*, app/*)
- **Environment:** jsdom + Next.js
- **Config:** `jest.config.components.js`
- **Speed:** ~30-60 seconds
- **Speedup:** Still **10x faster** with optimizations

## Usage

```bash
# Fast unit tests (run these frequently during development)
npm run test:fast

# Fast unit tests in CI mode
npm run test:fast:ci

# Component tests (run before commits)
npm run test:components

# Run all tests
npm run test:all

# Watch mode (auto-runs fast tests on file changes)
npm run test:fast -- --watch
```

## Performance Comparison

| Test Type | Before | After | Speedup |
|-----------|--------|-------|---------|
| Unit Tests | 20+ min | 10 sec | **120x** |
| Component Tests | 10+ min | 45 sec | **13x** |
| **Total** | **30+ min** | **55 sec** | **33x** |

## Best Practices

### 1. Keep Tests Fast
- Unit tests should complete in < 50ms each
- Component tests should complete in < 500ms each
- Use `test.only()` during development to run single tests

### 2. Avoid Slow Operations
```javascript
// ❌ Slow: Real API calls
test('fetches data', async () => {
  const data = await fetch('https://api.example.com')
})

// ✅ Fast: Mocked
test('fetches data', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ json: () => mockData }))
})
```

### 3. Use Appropriate Test Environment
```javascript
// Pure logic → Use fast config (Node.js)
// lib/config.test.ts ✅

// React components → Use component config (jsdom)
// components/hero.test.tsx ✅
```

### 4. Test Isolation
- Each test should be independent
- Use `beforeEach` / `afterEach` for cleanup
- Don't share state between tests

## Monitoring Performance

```bash
# Show timing for each test
npm run test:fast -- --verbose

# Generate coverage report
npm run test:fast -- --coverage

# Run specific test file
npm run test:fast -- __tests__/lib/config.test.ts
```

## CI/CD Integration

In CI pipelines, run fast tests first for quick feedback:

```yaml
# Example GitHub Actions
- name: Fast unit tests
  run: npm run test:fast:ci
  
- name: Component tests (only if unit tests pass)
  run: npm run test:components
```

## Troubleshooting

### Tests timing out
- Check for unresolved promises
- Ensure mocks are properly cleaning up
- Use `jest.setTimeout()` if needed

### Import errors
- Make sure `@/` path alias is configured in both jest configs
- Check that tsconfig.json paths match

### Memory issues
- Reduce `maxWorkers` in jest config
- Use `--runInBand` flag for sequential execution
- Clear `.jest-cache` directories

## Future Optimizations

1. **Sharded testing:** Split component tests across multiple CI jobs
2. **Selective testing:** Only run tests for changed files
3. **Caching:** Cache node_modules and .next between runs
4. **Test coverage:** Add coverage thresholds to prevent slow tests

