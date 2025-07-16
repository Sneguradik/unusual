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
    backendUrl: "http://unusual.office.np:6060",
  }
};

export default nextConfig;
