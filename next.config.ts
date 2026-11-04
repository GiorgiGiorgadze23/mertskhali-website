import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The old *.vercel.app address forwards to the real domain so Google indexes only one copy.
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "mertskhali-website.vercel.app" }], destination: "https://www.mertskhali1925.com/:path*", permanent: true },
    ];
  },
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
