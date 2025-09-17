/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14, no need for experimental flag
  reactStrictMode: true,
  // Suppress Grammarly extension warnings
  onDemandEntries: {
    // Suppress hydration warnings for Grammarly
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig 