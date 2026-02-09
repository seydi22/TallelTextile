import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/types/session";

// Fonction pour obtenir l'URL du backend
const getBackendUrl = () => {
  // En développement, utiliser localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // En production, utiliser l'URL du backend Vercel
  // Si NEXT_PUBLIC_API_BASE_URL est défini, extraire l'URL de base (sans /api)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
    // Si l'URL contient /api, retirer /api pour obtenir l'URL de base
    return apiUrl.replace(/\/api$/, '');
  }
  
  // Sinon, utiliser l'URL du backend Vercel directement
  return process.env.BACKEND_URL || 'https://tallel-textile-j62y.vercel.app';
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // NextAuth gère mieux null que throw Error
        }
        
        try {
          const backendUrl = getBackendUrl();
          
          // Appeler le backend pour l'authentification
          // Le backend vérifie email + password et retourne l'utilisateur si valide
          const authResponse = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          
          if (!authResponse.ok) {
            // 401 = credentials invalides, 404 = utilisateur non trouvé
            if (authResponse.status === 401 || authResponse.status === 404) {
              return null; // NextAuth affichera "CredentialsSignin" error
            }
            // Autres erreurs (500, etc.)
            console.error(`[NextAuth] Erreur backend: ${authResponse.status} ${authResponse.statusText}`);
            return null;
          }
          
          const authUser = await authResponse.json();
          
          // Retourner l'utilisateur au format attendu par NextAuth
          return {
            id: authUser.id,
            email: authUser.email,
            role: authUser.role || "user"
          };
        } catch (error: any) {
          console.error("[NextAuth] Erreur d'authentification:", error);
          // Erreur de connexion au backend
          if (error?.message?.includes('fetch failed') || error?.code === 'ECONNREFUSED') {
            console.error("[NextAuth] Impossible de se connecter au backend:", getBackendUrl());
            return null;
          }
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as User).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "user";
      }
      return session;
    },
    async signIn({ user }) {
      // Permettre la connexion si l'utilisateur existe
      return !!user;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production",
  // Ne pas définir 'url' explicitement - NextAuth détectera automatiquement l'URL
  // de la requête actuelle, ce qui fonctionne mieux avec les URLs dynamiques de Vercel
  // NEXTAUTH_URL est toujours recommandé comme variable d'environnement pour les avertissements,
  // mais ne doit pas être utilisé dans l'option 'url' ici
  // Avertir si NEXTAUTH_SECRET n'est pas défini en production
  ...(process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET && {
    debug: true, // Activer le debug pour voir les avertissements
  }),
  // Configuration pour éviter les erreurs de contexte
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NODE_ENV === "production",
};
