import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/callback/credentials
// NextAuth utilise cette route pour traiter les soumissions de formulaire de connexion avec credentials
const handler = NextAuth(authOptions);

// GET : Généralement pas utilisé pour credentials, mais on le gère au cas où
export async function GET(req: NextRequest) {
  return handler(req as any, { params: { nextauth: ['callback', 'credentials'] } } as any);
}

// POST : Gérer les soumissions de formulaire de connexion avec credentials
export async function POST(req: NextRequest) {
  // Cette route est appelée par NextAuth quand signIn("credentials", {...}) est utilisé
  // Le handler NextAuth va appeler authorize() dans authOptions
  return handler(req as any, { params: { nextauth: ['callback', 'credentials'] } } as any);
}
