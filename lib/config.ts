const config = {
  // En production sur Vercel, utiliser des URLs relatives pour les appels API
  // En développement, utiliser l'URL du backend local
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 
    (typeof window !== 'undefined' ? '' : 'http://localhost:3001'), // URLs relatives côté client, localhost côté serveur
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;

