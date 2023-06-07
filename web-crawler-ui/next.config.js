/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  skipTypescriptChecking: true,
  typescript: {
    transpileOnly: true,
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
