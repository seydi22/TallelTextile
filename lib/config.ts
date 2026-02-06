const config = {
  // Si NEXT_PUBLIC_API_BASE_URL est défini (projet backend séparé), l'utiliser
  // Sinon, utiliser des URLs relatives (même projet) ou localhost (développement)
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 
    (typeof window !== 'undefined' ? '' : 'http://localhost:3001'), // URLs relatives côté client si même projet, localhost côté serveur
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;

