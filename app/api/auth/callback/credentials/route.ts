import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/callback/credentials
// NextAuth utilise cette route pour traiter les soumissions de formulaire de connexion avec credentials
// IMPORTANT: Utiliser directement le handler sans wrapper pour éviter les problèmes de contexte
const handler = NextAuth(authOptions);

// Exporter directement le handler - NextAuth gère automatiquement le routage
export { handler as GET, handler as POST };
