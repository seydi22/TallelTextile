const getApiBaseUrl = () => {
  // Toujours retourner une chaîne, jamais undefined
  let url: string = '';
  
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    url = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ''); // Retirer le slash final
    
    // Si l'URL contient /api à la fin, le retirer car les endpoints dans le code incluent déjà /api
    // Exemple: https://backend.vercel.app/api -> https://backend.vercel.app
    url = url.replace(/\/api$/, '');
    
    return url;
  }
  
  // En développement, utiliser le backend sur le port 3001
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  if (typeof window !== 'undefined') {
    // Côté client en production : utiliser l'URL du backend depuis NEXT_PUBLIC_API_BASE_URL
    // Si pas défini, utiliser une chaîne vide pour les URLs relatives
    // Mais en production Vercel avec backend séparé, on DOIT avoir NEXT_PUBLIC_API_BASE_URL
    return '';
  }
  
  // Côté serveur : localhost en développement
  return 'http://localhost:3001';
};

// Calculer apiBaseUrl de manière dynamique pour éviter les problèmes de build
const apiBaseUrl = getApiBaseUrl() || '';

// Logger l'URL de base utilisée (uniquement côté client pour éviter les logs serveur)
if (typeof window !== 'undefined') {
  const displayUrl = apiBaseUrl || window.location.origin;
  console.log(`🔗 [API Config] Base URL utilisée: ${displayUrl}`);
  console.log(`🔗 [API Config] NEXT_PUBLIC_API_BASE_URL: ${process.env.NEXT_PUBLIC_API_BASE_URL || 'non défini (URLs relatives)'}`);
}

const config = {
  apiBaseUrl,
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
};

export default config;

