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
  
  return (
    <NextAuthSessionProvider session={safeSession}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
