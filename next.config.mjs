/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: ""
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: ""
          },
        ],
      },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        // Ne pas exposer NEXTAUTH_URL côté client pour forcer NextAuth à utiliser l'URL relative
        // NextAuth utilisera automatiquement window.location.origin côté client
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
    // Ne pas utiliser rewrites pour les routes API backend
    // Les routes Next.js (comme /api/auth/*) seront gérées automatiquement
    // Les routes backend seront routées via vercel.json
};

export default nextConfig;
