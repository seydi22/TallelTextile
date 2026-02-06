import config from './config';

export const apiClient = {
  baseUrl: config.apiBaseUrl,
  
  async request(endpoint: string, options: RequestInit = {}) {
    // Utiliser l'URL de base ou une URL relative si baseUrl est vide (production Vercel)
    const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : endpoint;
    
    // Logger l'URL complète utilisée (uniquement en développement ou si explicitement demandé)
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_API === 'true') {
      console.log(`🌐 [API Request] ${options.method || 'GET'} ${url}`);
    }
    
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
};

export default apiClient;
