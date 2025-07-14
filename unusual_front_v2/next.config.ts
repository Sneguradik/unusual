import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  serverRuntimeConfig:{
    tokenValidityInSeconds: 600,
    refreshTokenValidityInDays: 7,
  },
  publicRuntimeConfig:{
    backendUrl: "/mapi",
  }
};

export default nextConfig;
