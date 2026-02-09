import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Créer le handler NextAuth
// NextAuth v4 avec Next.js 15 App Router
// Le handler NextAuth est compatible avec l'App Router et gère automatiquement
// toutes les routes sous /api/auth/* (providers, signin, callback, etc.)
const handler = NextAuth(authOptions);

// Exporter directement le handler comme GET et POST
// NextAuth gère automatiquement le routage interne
export { handler as GET, handler as POST };
