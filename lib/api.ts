import config from './config';

export const apiClient = {
  baseUrl: config.apiBaseUrl,
  
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    
    try {
      return await fetch(url, { ...defaultOptions, ...options });
    } catch (error: any) {
      // Améliorer le message d'erreur pour les erreurs de connexion
      const errorMessage = error?.message || String(error);
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
