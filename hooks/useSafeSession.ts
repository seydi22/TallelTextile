"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Hook personnalisé pour utiliser useSession de manière sécurisée
 * Évite les erreurs de destructuration si le contexte NextAuth n'est pas encore initialisé
 */
export function useSafeSession() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Attendre un peu pour que le contexte NextAuth soit initialisé
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Utiliser useSession de manière inconditionnelle (règle des hooks React)
  // Mais protéger contre les erreurs de destructuration
  let sessionResult: any = null;
  try {
    sessionResult = useSession();
  } catch (error: any) {
    // Si erreur de destructuration, retourner des valeurs par défaut
    if (error?.message?.includes("Cannot destructure") || error?.message?.includes("auth")) {
      console.warn("NextAuth context not ready, returning default session");
      return {
        data: null,
        status: "loading" as const,
      };
    }
    // Pour les autres erreurs, les propager
    throw error;
  }

  // Si le contexte n'est pas encore prêt, retourner des valeurs par défaut
  if (!isReady && sessionResult?.status === "loading") {
    return {
      data: null,
      status: "loading" as const,
    };
  }

  return sessionResult || {
    data: null,
    status: "loading" as const,
  };
}
