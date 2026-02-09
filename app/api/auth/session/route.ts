import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/session
// Retourne la session actuelle de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json(session);
  } catch (error: any) {
    console.error("[NextAuth Session] Error:", error);
    return NextResponse.json(
      { error: "Failed to get session", message: error.message },
      { status: 500 }
    );
  }
}
