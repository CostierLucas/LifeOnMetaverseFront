/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ["lifeonmetaversebucket.s3.amazonaws.com", "localhost"],
  },
};

module.exports = nextConfig;
