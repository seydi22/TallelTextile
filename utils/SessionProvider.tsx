"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface CustomSessionProviderProps {
  children: React.ReactNode;
  session: any | null; 
}

const SessionProvider = ({ children, session }: CustomSessionProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // S'assurer que session est bien un objet ou null, jamais undefined
  const safeSession = session && typeof session === 'object' ? session : null;
  
  // Attendre que le composant soit monté côté client avant de rendre le provider
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Vérifier que NEXTAUTH_URL est configuré pour éviter les erreurs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // NEXTAUTH_URL n'est pas disponible côté client, c'est normal
      // Mais on peut vérifier si l'API NextAuth est accessible
      const checkNextAuth = async () => {
        try {
          const response = await fetch('/api/auth/session', { 
            method: 'GET',
            credentials: 'include'
          });
          if (!response.ok) {
            console.warn('⚠️ NextAuth API non accessible. Vérifiez NEXTAUTH_URL et NEXTAUTH_SECRET dans Vercel.');
          }
        } catch (error) {
          console.warn('⚠️ Erreur lors de la vérification NextAuth:', error);
        }
      };
      checkNextAuth();
    }
  }, []);
  
  // Ne pas rendre le provider avant que le composant soit monté côté client
  if (!isMounted || hasError) {
    return <>{children}</>;
  }
  
  // Wrapper pour capturer les erreurs de contexte NextAuth
  try {
    return (
      <NextAuthSessionProvider 
        session={safeSession}
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        {children}
      </NextAuthSessionProvider>
    );
  } catch (error) {
    console.error('❌ Erreur dans SessionProvider:', error);
    setHasError(true);
    // En cas d'erreur, retourner les enfants sans le provider (mode dégradé)
    return <>{children}</>;
  }
};

export default SessionProvider;
