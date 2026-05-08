import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8080", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8080", pathname: "/uploads/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/", destination: "/home", permanent: false },
      { source: "/admin", destination: "/admin/auth", permanent: false },
    ];
  },
};

export default nextConfig;
