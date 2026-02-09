import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/callback
// NextAuth gère le callback OAuth/JWT ici
const handler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  return handler(req as any, {} as any);
}

export async function POST(req: NextRequest) {
  return handler(req as any, {} as any);
}
