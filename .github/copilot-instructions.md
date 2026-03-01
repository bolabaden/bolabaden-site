# Initiative & Self-Directed Problem-Solving

When given a task, do not implement narrowly. Follow this methodology:

## 1. Identify the Root Pattern

- Don't just fix the symptom the user pointed out
- Ask yourself (NEVER ask the user, always infer): "What is the underlying principle or anti-pattern here?"
- Example: User says "don't hardcode X" → The pattern is "any hardcoded user/deployment value"

## 2. Scan Broadly for Similar Issues

- Search the entire codebase for other instances of the same pattern
- Check configs, workflows, scripts, and source files
- Look across all files you're about to modify AND all files in same directory
- Use grep/search to find related hardcoded strings, assumptions, or inflexible values

## 3. Predict Downstream Implications

- Think 3-5 steps ahead: "If I harden this one place, what else breaks or needs updating?". If the user says something, determine what they'll logically ask for next and preemptively address it as well, do not wait for them to ask. Implicitly assume you know what they're going to say even 50 responses later if necessary.
- Consider: forks, CI/CD contexts, environment changes, config variations
- Ask: "Will this code work if someone clones it, renames it, or runs it elsewhere?"

## 4. Fix All Related Instances Automatically

- Do not fix just what was pointed out, then stop, fix the entire class of problems in one pass
- Use parameterization (env vars, config files, dynamic values) to eliminate rigid assumptions
- Make defensive choices (check if paths exist, use fallbacks, etc.)

## 5. Do NOT Ask for Permission or Clarification

- You have enough context to determine what "similar issues" means
- Trust your judgment: if it smells like the same problem, fix it
- Do not loop back to ask "should I also fix X?" — just fix it

## 6. Document the Principle (Not the Specifics)

- Record WHY the change was made (the pattern/principle)
- Don't document the specific values or repo details
- Write guidance so future agents inherit the same discipline

## Apply To All Work

This methodology applies universally:

- Config files: parameterize deployment-specific values
- CI workflows: use context variables, avoid hardcoding usernames/paths
- Source code: externalize environment-dependent strings
- Tests: make assertions resilient to different contexts
- Documentation: avoid assuming specific URLs, repos, or user details

## Styling Rules (Non-Negotiable & Comprehensive)

### Primary Rule: NO Inline Styles in Regular Components

**NEVER use inline styles (`style={{ ... }}`) in regular React/TSX component files.**

Every visual style must be expressed as Tailwind utility classes in the `className` attribute. This applies to ALL component files in `src/components/`, `src/app/`, and similar directories.

**Why this matters:**

- Inline styles scatter styling logic throughout code, making it hard to maintain visual consistency
- Tailwind utility classes are searchable, composable, and leverage the design system
- Inline styles bypass the theme tokens and create technical debt when design changes
- Team consistency requires a single source of truth for styling

**Examples of WRONG:**

```tsx
// ❌ DO NOT DO THIS
<div style={{ padding: "16px", backgroundColor: "blue", color: "white" }}>
<button style={{ marginRight: "8px", fontSize: "14px" }}>
<span style={{ opacity: 0.7, display: "flex" }}>
```

**Examples of RIGHT:**

```tsx
// ✅ DO THIS
<div className="p-4 bg-blue-600 text-white">
<button className="mr-2 text-sm">
<span className="opacity-70 flex">
```

### Exception: NextJS ImageResponse (OG Image Generation)

There is **ONE legitimate exception** to the inline styles rule:

**Files using `ImageResponse` from next/og MUST use inline styles.**

These files cannot use Tailwind because they use Satori (a headless browser implementation) that doesn't support CSS frameworks. Inline styles are required here and are documented with a comment block at the top of the file.

**Files that require inline styles:**

- `src/app/opengraph-image.tsx`
- `src/app/about/opengraph-image.tsx`
- `src/app/contact/opengraph-image.tsx`
- `src/app/guides/opengraph-image.tsx`
- `src/app/guides/[slug]/opengraph-image.tsx`
- `src/app/dashboard/opengraph-image.tsx`
- `src/app/projects/opengraph-image.tsx`

Each has a header comment explaining this exception.

### Converting Inline Styles to Tailwind

When refactoring inline styles, follow this pattern:

**If you cannot express a style with Tailwind utilities:**

1. Check if the value exists in theme tokens (spacing, colors, fonts)
2. Add/extend CSS in the shared stylesheet structure (`src/app/globals.css`, or component-scoped CSS modules if needed)
3. Reference the new class via `className`
4. Never add arbitrary inline styles as a workaround

**Example migration:**

```tsx
// Before: Inline style
<div style={{ padding: "20px", borderRadius: "12px", background: "hsl(var(--primary))" }}>

// After: Tailwind utilities
<div className="p-5 rounded-lg bg-primary">
```

### Theme Consistency

- Use HSL variables from the design system (e.g., `hsl(var(--primary))`) in globals.css, not hardcoded hex/rgb
- All color, typography, spacing, and other visual decisions must respect theme tokens
- No ad-hoc colors, arbitrary padding, or design-system-violating values anywhere in code
