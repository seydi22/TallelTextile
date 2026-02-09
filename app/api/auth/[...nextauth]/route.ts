import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Créer le handler NextAuth
// NextAuth v4 avec Next.js 15 App Router
// Le handler NextAuth est compatible avec l'App Router et gère automatiquement
// toutes les routes sous /api/auth/* (providers, signin, callback, etc.)
const handler = NextAuth(authOptions);

// Exporter les handlers GET et POST avec la signature correcte pour Next.js 15 App Router
// Le contexte params.nextauth contient les segments de route après /api/auth/
// Exemple: /api/auth/signin → params.nextauth = ['signin']
//          /api/auth/callback/credentials → params.nextauth = ['callback', 'credentials']
export async function GET(
  req: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  return handler(req as any, context as any);
}

export async function POST(
  req: NextRequest,
  context: { params: { nextauth: string[] } }
) {
  return handler(req as any, context as any);
}
