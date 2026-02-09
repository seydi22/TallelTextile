const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ''); // Retirer le slash final
    
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
    // Côté client en production : URLs relatives (même projet Vercel)
    return '';
  }
  
  // Côté serveur : localhost en développement
  return 'http://localhost:3001';
};

const apiBaseUrl = getApiBaseUrl();

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

