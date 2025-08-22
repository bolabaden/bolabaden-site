# GitHub Pages Deployment

This repository is now configured to automatically deploy to GitHub Pages at https://bolabaden.github.io/bolabaden-site.

## How It Works

### Dual Configuration
The Next.js configuration (`next.config.js`) now supports two deployment modes:

1. **Docker Mode** (default): Uses `output: 'standalone'` for containerized deployment
2. **GitHub Pages Mode**: Uses `output: 'export'` for static site generation when `GITHUB_PAGES=true`

### Automatic Deployment
The workflow (`.github/workflows/deploy-github-pages.yml`) triggers on:
- Push to `main` or `master` branch
- Manual workflow dispatch from GitHub Actions tab

### Build Process
1. Checks out code and sets up Node.js
2. Installs dependencies
3. Temporarily moves API routes (not compatible with static export)
4. Builds with static export configuration
5. Restores API routes
6. Deploys static files to GitHub Pages

## Configuration Details

### basePath Configuration
When deploying to GitHub Pages, the site uses `/bolabaden-site` as the base path since it's deployed to a subdirectory. This ensures all assets and links work correctly.

### API Routes Handling
API routes in `app/api/` are temporarily moved during the GitHub Pages build since they don't work with static export. The original Docker deployment still has full API functionality.

### Dynamic Routes
All dynamic routes (like `/guides/[slug]`) include `generateStaticParams` functions to pre-generate all possible pages at build time.

## Manual Testing

To test the GitHub Pages build locally:

```bash
# Install dependencies
npm install

# Build for GitHub Pages
GITHUB_PAGES=true npm run build

# Check the output directory
ls -la out/
```

The `out/` directory contains the static site ready for deployment.

## Troubleshooting

### Build Failures
- Ensure all dynamic routes have `generateStaticParams` functions
- Check that no server-side code is used in components during static export
- Verify API calls have proper error handling for when APIs aren't available

### Asset Issues
- All internal links should be relative or use Next.js `Link` component
- Images should use Next.js `Image` component or be placed in `public/` directory
- CSS and JS assets are automatically handled by Next.js with the correct basePath

## URLs

- **GitHub Pages**: https://bolabaden.github.io/bolabaden-site
- **Local Development**: http://localhost:3000
- **Docker Deployment**: Uses original domain configuration

The site automatically adapts its configuration based on the deployment environment.