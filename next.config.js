/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil'
    });
  },
  images: {
    remotePatterns: [
      { hostname: 'uploadthing.com', protocol: 'https' },
      { hostname: 'utfs.io', protocol: 'https' }
    ]
  }
};

module.exports = nextConfig;
