# Contributing to Bolabaden Portfolio

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/bolabaden-site.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/my-improvement`
5. Make your changes
6. Test your changes: `npm run test:ci && npm run build`
7. Commit with a descriptive message (see format below)
8. Push to your fork and submit a pull request

## Development Workflow

### Running Locally

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests in watch mode
npm run test:ci      # Run tests once (CI mode)
npm run lint         # Lint code
npm run type-check   # TypeScript type checking
```

### Code Standards

- **TypeScript:** Use strict typing; avoid `any` types
- **Components:** Prefer functional components with hooks
- **Styling:** Use Tailwind CSS utility classes
- **Testing:** Write tests for new features and bug fixes
- **Accessibility:** Follow WCAG 2.1 AA guidelines

## Commit Message Format

We use conventional commits for clear history:

```
<type>(<scope>): <short description> — <why>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- refactor: Code refactoring
- test: Adding or updating tests
- chore: Maintenance tasks
- style: Code style changes (formatting, etc.)

Examples:
feat(projects): add case study metrics to CloudCradle — demonstrates real outcomes
fix(hero): correct profile image aspect ratio on mobile — improves visual consistency
docs(readme): add deployed commit hash — helps verify production version
test(components): add unit tests for ProjectCard — ensures props render correctly
```

### Why Include Rationale?

Including "why" in commit messages helps future maintainers (including yourself) understand the reasoning behind changes. This is especially important for:
- Design decisions
- Performance optimizations
- Bug fixes with non-obvious causes
- Breaking changes

## Pull Request Guidelines

### Before Submitting

- [ ] All tests pass (`npm run test:ci`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Linter passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Changes are documented in code comments
- [ ] New features have corresponding tests

### PR Description Template

```markdown
## Description
Brief description of what this PR does and why.

## Changes
- Bullet list of specific changes
- Include file names and functions modified

## Testing
How did you test this?
- [ ] Manual testing in dev environment
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Lighthouse performance tested

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #123
Relates to #456
```

## Design Decisions

When making non-trivial changes, include design reasoning in:
1. Commit messages (the "why" part)
2. Code comments for complex logic
3. PR description

Example:
```typescript
// Use exponential backoff here because the GitHub API rate-limits aggressively
// A simple retry would cause cascading failures during peak traffic
async function fetchWithRetry(url: string, retries = 3) {
  // implementation...
}
```

## Testing Guidelines

### Unit Tests

- Test components in isolation
- Mock external dependencies
- Focus on user-facing behavior, not implementation details

```typescript
// Good: Tests user-visible behavior
test('ProjectCard displays project title and description', () => {
  render(<ProjectCard project={mockProject} />)
  expect(screen.getByText(mockProject.title)).toBeInTheDocument()
})

// Less useful: Tests implementation
test('ProjectCard calls useState', () => {
  // ...
})
```

### Integration Tests

- Test component interactions
- Test data fetching and error states
- Test accessibility with screen readers

## Code Review Process

1. Maintainer reviews PR within 3-5 business days
2. Feedback is provided as line comments
3. Once approved, maintainer will merge
4. For larger changes, expect multiple review rounds

## Questions?

- Open an issue for questions about contributing
- Email: boden.crouch@gmail.com
- Check existing issues and PRs for similar discussions

## License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

