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
  console.log('[NextAuth Callback Credentials] GET request received');
  try {
    const result = await handler(req as any, { params: { nextauth: ['callback', 'credentials'] } } as any);
    console.log('[NextAuth Callback Credentials] GET result:', result?.status || 'no status');
    return result;
  } catch (error: any) {
    console.error('[NextAuth Callback Credentials] GET error:', error);
    throw error;
  }
}

// POST : Gérer les soumissions de formulaire de connexion avec credentials
export async function POST(req: NextRequest) {
  console.log('[NextAuth Callback Credentials] POST request received');
  try {
    // Cette route est appelée par NextAuth quand signIn("credentials", {...}) est utilisé
    // Le handler NextAuth va appeler authorize() dans authOptions
    const result = await handler(req as any, { params: { nextauth: ['callback', 'credentials'] } } as any);
    console.log('[NextAuth Callback Credentials] POST result:', result?.status || 'no status');
    return result;
  } catch (error: any) {
    console.error('[NextAuth Callback Credentials] POST error:', error);
    throw error;
  }
}
