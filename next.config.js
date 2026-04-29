/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Enable image optimization for static export
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  async redirects() {
    return [
      { source: '/042026/promo', destination: '/052026/promo', permanent: true },
    ]
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Jangan pakai `optimizePackageImports` untuk react-icons / framer-motion di Next 15 + webpack:
  // bundle server sering require `./vendor-chunks/*.js` yang tidak ada (runtime error).
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize chunks
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
