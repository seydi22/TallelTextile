import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AdminSession {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export async function getSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value) as AdminSession & { timestamp?: number };
      
      // Vérifier que la session a les champs requis
      if (!sessionData.id || !sessionData.email || !sessionData.role) {
        return null;
      }

      // Vérifier le timeout d'inactivité (5 minutes)
      // Note: Cette vérification côté serveur est une sécurité supplémentaire
      // Le timeout principal est géré côté client
      if (sessionData.timestamp) {
        const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
        const timeSinceLastActivity = Date.now() - sessionData.timestamp;
        
        if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
          console.log('[AdminAuth] Session expirée par inactivité');
          return null;
        }
      }

      // Retourner la session sans le timestamp
      const { timestamp, ...session } = sessionData;
      return session as AdminSession;
    } catch (parseError) {
      // Cookie invalide, le supprimer
      console.error('[AdminAuth] Erreur de parsing du cookie:', parseError);
      return null;
    }
  } catch (error) {
    console.error('[AdminAuth] Erreur lors de la récupération de la session:', error);
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  
  if (session.role !== "admin") {
    redirect("/");
  }
  
  return session;
}

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.role === "admin";
}
