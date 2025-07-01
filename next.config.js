/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/docs',
        destination: '/api-docs',
      },
    ];
  },
};

module.exports = nextConfig; 