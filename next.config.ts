import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/guides/how-to-sell-car", destination: "/guides/how-to-sell-a-car-complete-guide", permanent: true },
      { source: "/guides/sell-car-on-finance", destination: "/guides/selling-car-with-outstanding-finance", permanent: true },
      { source: "/guides/car-valuation", destination: "/guides/understanding-car-valuation", permanent: true },
    ];
  },
};

export default nextConfig;
