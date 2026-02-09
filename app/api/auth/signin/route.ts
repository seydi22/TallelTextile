import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/signin
// NextAuth devrait normalement gérer cela via [...nextauth], mais créons une route explicite
// Cette route gère la page de connexion NextAuth
const handler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  // NextAuth gère automatiquement /api/auth/signin pour afficher la page de connexion
  // ou rediriger vers la page personnalisée configurée dans pages.signIn
  return handler(req as any, {} as any);
}

export async function POST(req: NextRequest) {
  // NextAuth gère les soumissions de formulaire de connexion
  return handler(req as any, {} as any);
}
