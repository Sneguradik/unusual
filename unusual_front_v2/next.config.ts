import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  serverRuntimeConfig:{
    tokenValidityInSeconds: 600,
    refreshTokenValidityInDays: 7,
    serverBackendUrl: "http://webapi:8080",
  },
  publicRuntimeConfig:{
    backendUrl: "http://0.0.0.0:6060",
  }
};

export default nextConfig;
