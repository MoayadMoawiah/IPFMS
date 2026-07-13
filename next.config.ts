import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: "/donors", destination: "/settings/donors", permanent: true },
      { source: "/donors/new", destination: "/settings/donors/new", permanent: true },
    ];
  },
};

export default nextConfig;
