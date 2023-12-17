/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil'
    });
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });
    return config;
  },
  images: {
    remotePatterns: [
      { hostname: 'uploadthing.com', protocol: 'https' },
      { hostname: 'utfs.io', protocol: 'https' }
    ]
  }
};

module.exports = nextConfig;
