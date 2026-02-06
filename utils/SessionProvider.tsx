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
  
  // Vérifier que NEXTAUTH_URL est configuré pour éviter les erreurs
  if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_NEXTAUTH_URL && !process.env.NEXTAUTH_URL) {
    console.warn('⚠️ NEXTAUTH_URL n\'est pas configuré. L\'authentification pourrait ne pas fonctionner correctement.');
  }
  
  return (
    <NextAuthSessionProvider session={safeSession}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
