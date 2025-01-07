/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['i.ibb.co', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
  basePath: '',
  assetPrefix: './',
  trailingSlash: true,
}

module.exports = nextConfig 