/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  // Use export for GitHub Pages, standalone for Docker
  output: isGitHubPages ? 'export' : 'standalone',
  
  // GitHub Pages deployment is served from a subdirectory
  basePath: isGitHubPages ? '/bolabaden-site' : '',
  assetPrefix: isGitHubPages ? '/bolabaden-site/' : '',
  
  // Disable image optimization for static export
  images: {
    unoptimized: isGitHubPages,
    domains: ['github.com', 'raw.githubusercontent.com'],
  },
  
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: isGitHubPages,
  
  async headers() {
    if (isGitHubPages) {
      // Skip headers for static export
      return [];
    }
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    if (isGitHubPages) {
      // Skip redirects for static export
      return [];
    }
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig; 