import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',  // Google user profile images
      'seanoirblob.blob.core.windows.net',  // Your custom blob storage
      'images.unsplash.com',  // Unsplash images
      'firebasestorage.googleapis.com',  // Firebase Storage
      'storage.googleapis.com',  // Google Cloud Storage
      'localhost',  // Local development
      'placekitten.com',  // Placeholder images
      'picsum.photos',  // Placeholder images
      'via.placeholder.com',  // Placeholder images
      'randomuser.me',  // Random user profile images
      'cloudflare-ipfs.com',  // IPFS images
    ],
    unoptimized: true,
  },
};

export default withFlowbiteReact(nextConfig);
