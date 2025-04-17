import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['pdf-parse', '@azure-rest/ai-inference', '@azure/core-auth', '@azure/core-sse'],
  // experimental: {
  //   serverComponentsExternalPackages: ['pdf-parse', '@azure-rest/ai-inference', '@azure/core-auth', '@azure/core-sse'],
  // },
};

export default nextConfig;
