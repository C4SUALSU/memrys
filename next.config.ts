/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Required to make <Image> work without a server
  images: {
    unoptimized: true,
  },
  // Optional: ensures /about/ becomes /about/index.html 
  // (Fixes 404s on some static hosts)
  trailingSlash: true,
};

module.exports = nextConfig;