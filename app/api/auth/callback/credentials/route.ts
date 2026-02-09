import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/callback/credentials
// NextAuth utilise cette route pour traiter les soumissions de formulaire de connexion
const handler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  const context = { params: { nextauth: ['callback', 'credentials'] } };
  return handler(req as any, context as any);
}

export async function POST(req: NextRequest) {
  // Cette route gère les soumissions de formulaire de connexion avec credentials
  const context = { params: { nextauth: ['callback', 'credentials'] } };
  return handler(req as any, context as any);
}
