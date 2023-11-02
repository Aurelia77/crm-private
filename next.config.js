/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = nextConfig      (avant)
module.exports = {
    // On pt ajouter le STRICT MODE 
    //reactStrictMode: true,    // Si on le met => faire 2 fois l'appel au données FIREBASE !!! Pourquoi ???
    images: {
      domains: ['source.unsplash.com'],
      domains: ['logo.clearbit.com'],
    },
  }
