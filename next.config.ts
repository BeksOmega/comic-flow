import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export when BUILD_STATIC is set to 'true'
  ...(process.env.BUILD_STATIC === "true" && {
    output: "export",
    assetPrefix: "./",
    images: {
      unoptimized: true,
    },
  }),
  // For development, these settings are not applied
};

export default nextConfig;
