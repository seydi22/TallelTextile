import NextAuth, { NextAuthOptions } from "next-auth";
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
        token.role = (user as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
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
  // Définir NEXTAUTH_URL explicitement pour éviter les avertissements
  ...(process.env.NEXTAUTH_URL && {
    url: process.env.NEXTAUTH_URL,
  }),
  // Avertir si NEXTAUTH_SECRET n'est pas défini en production
  ...(process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET && {
    debug: true, // Activer le debug pour voir les avertissements
  }),
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
