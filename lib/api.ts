import config from './config';

// Helper function to safely parse JSON response
async function safeJsonParse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error(`❌ [API] Non-JSON response received (${response.status}):`, text.substring(0, 200));
    throw new Error(`La réponse du serveur n'est pas au format JSON (Content-Type: ${contentType || 'non défini'})`);
  }
  
  try {
    return await response.json();
  } catch (error: any) {
    const text = await response.text();
    console.error(`❌ [API] Failed to parse JSON response:`, text.substring(0, 200));
    throw new Error(`Erreur lors du parsing JSON: ${error.message}`);
  }
}

// Fonction pour obtenir l'URL de base dynamiquement
const getBaseUrl = () => {
  // PRIORITÉ 1: Si NEXT_PUBLIC_API_BASE_URL est défini, l'utiliser (sans /api à la fin)
  // Cette variable est disponible côté client ET serveur après le build
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    let url = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ''); // Retirer slash final
    url = url.replace(/\/api$/, ''); // Retirer /api si présent à la fin
    return url;
  }
  
  // PRIORITÉ 2: En développement, utiliser localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // PRIORITÉ 3: En production sans NEXT_PUBLIC_API_BASE_URL
  // Retourner chaîne vide = URL relative (ne devrait pas arriver si configuré correctement)
  console.warn('[API] NEXT_PUBLIC_API_BASE_URL non défini en production !');
  return '';
};

export const apiClient = {
  get baseUrl() {
    // Calculer dynamiquement pour éviter les problèmes de build
    return getBaseUrl();
  },
  
  async request(endpoint: string, options: RequestInit = {}) {
    // Normaliser l'endpoint (s'assurer qu'il commence par /)
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Obtenir l'URL de base dynamiquement
    const baseUrl = this.baseUrl;
    
    // Debug: Vérifier pourquoi baseUrl est vide
    if (!baseUrl && process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn(`⚠️ [API] baseUrl est vide mais NEXT_PUBLIC_API_BASE_URL est défini: "${process.env.NEXT_PUBLIC_API_BASE_URL}"`);
      // Forcer l'utilisation de NEXT_PUBLIC_API_BASE_URL
      const forcedUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '').replace(/\/api$/, '');
      const url = `${forcedUrl}${normalizedEndpoint}`;
      console.log(`🌐 [API Request] ${options.method || 'GET'} ${url} (forcé)`);
      console.log(`🌐 [API Request] baseUrl: "${forcedUrl}" (forcé depuis NEXT_PUBLIC_API_BASE_URL)`);
      console.log(`🌐 [API Request] endpoint: "${endpoint}"`);
      
      // Utiliser l'URL forcée
      const response = await fetch(url, { 
        ...defaultOptions, 
        ...options,
        signal: options.signal || controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (response.status === 404) {
        console.warn(`⚠️ [API] 404 Not Found: ${url}`);
        console.warn(`💡 Vérifiez que le backend est démarré: cd server && node app.js`);
      }
      
      return response;
    }
    
    // Utiliser l'URL de base ou une URL relative si baseUrl est vide
    const url = baseUrl ? `${baseUrl}${normalizedEndpoint}` : normalizedEndpoint;
    
    // Logger l'URL complète utilisée (toujours en production pour debug)
    console.log(`🌐 [API Request] ${options.method || 'GET'} ${url}`);
    console.log(`🌐 [API Request] baseUrl: "${baseUrl || '(vide - URL relative)'}"`);
    console.log(`🌐 [API Request] endpoint: "${endpoint}"`);
    console.log(`🌐 [API Request] NEXT_PUBLIC_API_BASE_URL: "${process.env.NEXT_PUBLIC_API_BASE_URL || 'non défini'}"`);
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    // Ajouter un timeout par défaut de 10 secondes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(url, { 
        ...defaultOptions, 
        ...options,
        signal: options.signal || controller.signal,
      });
      clearTimeout(timeoutId);
      
      // Log 404 errors with helpful message
      if (response.status === 404) {
        console.warn(`⚠️ [API] 404 Not Found: ${url}`);
        console.warn(`💡 Vérifiez que le backend est démarré: cd server && node app.js`);
      }
      
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      // Améliorer le message d'erreur pour les erreurs de connexion
      const errorMessage = error?.message || String(error);
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Timeout: Le serveur met trop de temps à répondre');
        (timeoutError as any).isConnectionError = true;
        throw timeoutError;
      }
      if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
        // Créer une erreur plus descriptive
        const connectionError = new Error('Backend API non disponible. Veuillez démarrer le serveur avec: cd server && node app.js');
        (connectionError as any).isConnectionError = true;
        throw connectionError;
      }
      throw error;
    }
  },
  
  // Convenience methods
  get: (endpoint: string, options?: RequestInit) => 
    apiClient.request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: 'DELETE' }),
  
  // Safe JSON parsing helper
  safeJsonParse: safeJsonParse,
};

export default apiClient;
