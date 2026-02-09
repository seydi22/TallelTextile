import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Route explicite pour /api/auth/signin
// NextAuth est configuré avec pages.signIn: "/login", donc on redirige vers la page de connexion personnalisée
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  // Rediriger vers la page de connexion personnalisée
  // NextAuth utilisera cette page pour afficher le formulaire de connexion
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", callbackUrl);
  
  return NextResponse.redirect(loginUrl);
}

// POST est géré par la route catch-all [...nextauth] pour les soumissions de formulaire
export async function POST(req: NextRequest) {
  // Rediriger vers la route catch-all qui gère les soumissions
  // En fait, les soumissions de formulaire sont gérées directement par signIn() côté client
  // Cette route POST ne devrait pas être appelée normalement
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
