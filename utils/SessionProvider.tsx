"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface CustomSessionProviderProps {
  children: React.ReactNode;
  session: any | null; 
}

const SessionProvider = ({ children, session }: CustomSessionProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  
  // S'assurer que session est bien un objet ou null, jamais undefined
  const safeSession = session && typeof session === 'object' ? session : null;
  
  // Attendre que le composant soit monté côté client avant de rendre le provider
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Vérifier que NEXTAUTH_URL est configuré pour éviter les erreurs
  useEffect(() => {
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_NEXTAUTH_URL && !process.env.NEXTAUTH_URL) {
      console.warn('⚠️ NEXTAUTH_URL n\'est pas configuré. L\'authentification pourrait ne pas fonctionner correctement.');
    }
  }, []);
  
  // Ne pas rendre le provider avant que le composant soit monté côté client
  if (!isMounted) {
    return <>{children}</>;
  }
  
  // Wrapper pour capturer les erreurs de contexte NextAuth
  try {
    return (
      <NextAuthSessionProvider session={safeSession}>
        {children}
      </NextAuthSessionProvider>
    );
  } catch (error) {
    console.error('❌ Erreur dans SessionProvider:', error);
    // En cas d'erreur, retourner les enfants sans le provider (mode dégradé)
    return <>{children}</>;
  }
};

export default SessionProvider;
