// next.config.js or next.config.ts if you're using TypeScript
import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'], // ✅ Add your image domain here
  },
  // You can add other config options as needed
};

export default withFlowbiteReact(nextConfig);
