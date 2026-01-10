import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.secilstore.com",
        pathname: "/docs/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.secilikart.com",
        pathname: "/docs/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.ilmio.com",
        pathname: "/docs/images/**",
      },
    ],
  },
};

export default nextConfig;
