import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_API_URL,
    }
};

export default nextConfig;
