import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/signin
// NextAuth utilise cette route pour afficher la page de connexion ou rediriger
const handler = NextAuth(authOptions);

// GET : Afficher la page de connexion ou rediriger vers la page personnalisée
export async function GET(req: NextRequest) {
  // NextAuth gère automatiquement la redirection vers pages.signIn configuré dans authOptions
  // On passe le handler NextAuth avec le contexte correct
  // Pour /api/auth/signin, le contexte devrait être ['signin']
  return handler(req as any, { params: { nextauth: ['signin'] } } as any);
}

// POST : Gérer les soumissions de formulaire de connexion
export async function POST(req: NextRequest) {
  // NextAuth gère les soumissions de formulaire
  // Pour les credentials, NextAuth fait généralement POST vers /api/auth/callback/credentials
  // Mais il peut aussi faire POST vers /api/auth/signin
  return handler(req as any, { params: { nextauth: ['signin'] } } as any);
}
