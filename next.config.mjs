/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ✅ Add this section to control ESLint behavior
  eslint: {
    // If true, builds won't fail even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
