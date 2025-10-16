import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow all HTTPS domains
      { protocol: "https", hostname: "**", pathname: "/**" },
      // Allow all HTTP domains (for local development)
      { protocol: "http", hostname: "**", pathname: "/**" },
    ],
    // Common CDN domains for better optimization
    domains: [
      'cdn.jsdelivr.net',
      'unpkg.com',
      'cdn.simpleicons.org',
      'via.placeholder.com',
      'placehold.co',
      'picsum.photos',
      'images.unsplash.com',
      'raw.githubusercontent.com',
    ],
    // Optionally allow data URLs
    formats: ["image/avif", "image/webp"],
    // Disable image optimization for external URLs to avoid issues
    unoptimized: false,
  },
};

export default nextConfig;
