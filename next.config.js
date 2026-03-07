/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "backend-skillbridge-fcih.onrender.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-skillbridge-fcih.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;