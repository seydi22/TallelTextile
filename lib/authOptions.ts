import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { User } from "@/types/session";

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
          throw new Error("Email et mot de passe requis");
        }
        
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user || !user.password) {
            throw new Error("Email ou mot de passe incorrect");
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Email ou mot de passe incorrect");
          }
          
          return {
            id: user.id,
            email: user.email,
            role: user.role || "user"
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          throw new Error("Erreur lors de l'authentification");
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
