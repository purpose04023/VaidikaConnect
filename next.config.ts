import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
