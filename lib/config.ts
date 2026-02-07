const getApiBaseUrl = () => {
  // En développement, toujours utiliser le backend local
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // En production (Vercel)
  if (typeof window !== 'undefined') {
    // Côté client en production Vercel
    // Si NEXT_PUBLIC_API_BASE_URL est défini et ne pointe PAS vers Vercel (backend externe)
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
      // Si l'URL ne contient pas 'vercel.app', c'est un backend externe - l'utiliser
      if (!apiUrl.includes('vercel.app')) {
        return apiUrl;
      }
      // Si l'URL contient 'vercel.app', c'est probablement le même projet - utiliser des URLs relatives
      // Cela évite les problèmes de résolution DNS avec les URLs Vercel dynamiques
      console.warn('⚠️ [API Config] NEXT_PUBLIC_API_BASE_URL pointe vers Vercel, utilisation d\'URLs relatives');
      return '';
    }
    
    // Par défaut en production Vercel : URLs relatives (même projet)
    return '';
  }
  
  // Côté serveur : utiliser NEXT_PUBLIC_API_BASE_URL si défini, sinon localhost
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
    // En production serveur, si l'URL pointe vers Vercel, utiliser des URLs relatives
    if (apiUrl.includes('vercel.app')) {
      return '';
    }
    return apiUrl;
  }
  
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

