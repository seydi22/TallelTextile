import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/signin
// NextAuth utilise cette route pour afficher la page de connexion ou rediriger
// IMPORTANT: Utiliser directement le handler sans wrapper pour éviter les problèmes de contexte
const handler = NextAuth(authOptions);

// Exporter directement le handler - NextAuth gère automatiquement le routage
export { handler as GET, handler as POST };
