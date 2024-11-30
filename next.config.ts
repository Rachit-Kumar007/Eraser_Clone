import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false; // Disable source maps in development
    }
    return config;
  },
};

export default nextConfig;
