import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Créer le handler NextAuth
// NextAuth v4 avec Next.js 15 App Router
const handler = NextAuth(authOptions);

// Exporter les handlers GET et POST
// NextAuth gère automatiquement toutes les routes sous /api/auth/*
// Le handler NextAuth est compatible avec Next.js App Router
export { handler as GET, handler as POST };
