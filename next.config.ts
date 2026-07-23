import type { NextConfig } from 'next';

// Derive the Supabase Storage hostname from the public env var so next/image
// can serve uploaded covers, book files, and the hero image.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      // Any Supabase project's public storage (covers the *.supabase.co CDN).
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
      ...(supabaseHost
        ? [{ protocol: 'https' as const, hostname: supabaseHost, pathname: '/**' }]
        : []),
    ],
  },
  transpilePackages: ['motion'],
};

export default nextConfig;
