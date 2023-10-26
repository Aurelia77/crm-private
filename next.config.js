/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = nextConfig      (avant)
module.exports = {
    // On pt ajouter le STRICT MODE 
    reactStrictMode: true,
    images: {
      domains: ['source.unsplash.com'],
      domains: ['logo.clearbit.com'],
    },
  }
