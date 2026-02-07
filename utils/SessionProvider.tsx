"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import React from "react";

interface CustomSessionProviderProps {
  children: React.ReactNode;
  session: any | null; 
}

const SessionProvider = ({ children, session }: CustomSessionProviderProps) => {
  // S'assurer que session est bien un objet ou null, jamais undefined
  const safeSession = session && typeof session === 'object' ? session : null;
  
  // Rendre directement le provider NextAuth avec la session sécurisée
  // Activer le refetch pour que la session soit mise à jour après la connexion
  return (
    <NextAuthSessionProvider 
      session={safeSession}
      refetchInterval={0} // Désactiver le refetch automatique, on le fera manuellement si besoin
      refetchOnWindowFocus={true} // Rafraîchir quand la fenêtre reprend le focus
    >
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
