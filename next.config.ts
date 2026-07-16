import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
    // TMDB already serves appropriately sized, cacheable artwork (w92-w1280).
    // Loading it directly avoids making availability and cost depend on the
    // Vercel image optimizer quota.
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb"
    }
  }
};

export default nextConfig;
