/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.im.ge',
      },
    ],
    domains: ['red-sky-drop.s3.sa-east-1.amazonaws.com', 'i.im.ge'],
  },
};

module.exports = nextConfig;
