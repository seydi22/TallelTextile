"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React, { useEffect } from "react";

interface CustomSessionProviderProps {
  children: React.ReactNode;
  session: any | null; 
}

const SessionProvider = ({ children, session }: CustomSessionProviderProps) => {
  // S'assurer que session est bien un objet ou null, jamais undefined
  const safeSession = session && typeof session === 'object' ? session : null;
  
  // Forcer NextAuth à utiliser l'URL actuelle côté client
  // Cela évite les problèmes avec NEXTAUTH_URL qui peut pointer vers une URL incorrecte
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Vérifier si NEXTAUTH_URL est définie et si elle ne correspond pas à l'URL actuelle
      const currentOrigin = window.location.origin;
      const nextAuthUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.NEXTAUTH_URL;
      
      if (nextAuthUrl && nextAuthUrl !== currentOrigin) {
        console.warn(
          `[NextAuth] NEXTAUTH_URL (${nextAuthUrl}) ne correspond pas à l'URL actuelle (${currentOrigin}). ` +
          `NextAuth utilisera automatiquement l'URL relative.`
        );
      }
    }
  }, []);
  
  // Rendre directement le provider NextAuth avec la session sécurisée
  // Activer le refetch pour que la session soit mise à jour après la connexion
  return (
    <NextAuthSessionProvider 
      session={safeSession}
      refetchInterval={0} // Désactiver le refetch automatique, on le fera manuellement si besoin
      refetchOnWindowFocus={true} // Rafraîchir quand la fenêtre reprend le focus
      basePath="/api/auth" // Forcer le basePath pour utiliser des URLs relatives
    >
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
