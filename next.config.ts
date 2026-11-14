import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the stage/commit history readable for the jury: no experimental flags here.
  reactStrictMode: true,
};

export default nextConfig;
