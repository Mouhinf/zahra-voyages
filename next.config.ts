import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['firebase'],
  // Racine de tracing explicite : un package-lock.json parasite existe au
  // niveau de /home/mouhammad et perturbait l'inférence (chunks manquants).
  outputFileTracingRoot: __dirname,
  // Vérification TypeScript activée au build (0 erreur au 2026-10-11).
  // ESLint reste ignoré ici : le dépôt comporte ~7 400 erreurs historiques
  // à traiter séparément.
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestudio.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.au-senegal.com',
      },
      {
        protocol: 'https',
        hostname: 'www.laresidencedakar.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/transfert-aibd',
        destination: '/lp/transfert-aibd',
        permanent: true,
      },
      {
        source: '/en/transfert-aibd',
        destination: '/en/lp/transfert-aibd',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
