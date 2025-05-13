import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ESLint errors ignore karo
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript errors ignore karo
  },
};

export default nextConfig;