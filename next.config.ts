import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
      {
        // Vercel Blob store (user avatars) — <storeId>.public.blob.vercel-storage.com
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Avatars are resized client-side to a small WebP before upload, so the
      // request body stays tiny; this raises the 1 MB default just for headroom.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
