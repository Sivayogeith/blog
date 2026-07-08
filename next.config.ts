import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://nuaetabrpiyqlyiypbcx.supabase.co/**")],
  },
};

export default nextConfig;
