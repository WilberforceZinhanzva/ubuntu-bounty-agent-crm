/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  }
}

module.exports = nextConfig