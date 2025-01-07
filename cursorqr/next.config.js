/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['i.ibb.co', 'lh3.googleusercontent.com']
  },
  experimental: {
    missingSuspenseWithCSRBailout: true
  }
}

module.exports = nextConfig 