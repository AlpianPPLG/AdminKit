import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "**", pathname: "/**" },
    ],
    // Optionally allow data URLs
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
