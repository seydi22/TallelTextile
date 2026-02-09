import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/callback
// NextAuth gère le callback OAuth/JWT ici
const handler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  // Le contexte doit contenir les paramètres de route comme dans [...nextauth]
  const context = { params: { nextauth: ['callback'] } };
  return handler(req as any, context as any);
}

export async function POST(req: NextRequest) {
  const context = { params: { nextauth: ['callback'] } };
  return handler(req as any, context as any);
}
