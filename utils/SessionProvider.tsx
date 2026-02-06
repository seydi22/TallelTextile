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
  
  // Ne pas rendre le provider avant que le composant soit monté côté client
  // Cela évite les erreurs d'hydratation et de contexte
  if (!isMounted) {
    return <>{children}</>;
  }
  
  // Rendre le provider NextAuth avec la session sécurisée
  return (
    <NextAuthSessionProvider 
      session={safeSession}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
