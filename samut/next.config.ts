import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'seanoirblob.blob.core.windows.net' // ✅ Add this line
    ],
  },
};

export default withFlowbiteReact(nextConfig);
