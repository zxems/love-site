/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // GitHub Pages settings
  basePath: process.env.NODE_ENV === 'production' ? '/love-website' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/love-website' : '',
  // This ensures media files work correctly
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/*',
      ],
    },
  },
}

export default nextConfig
