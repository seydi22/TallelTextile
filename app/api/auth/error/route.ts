import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  
  // Rediriger vers la page de login avec un message d'erreur
  const loginUrl = new URL("/login", request.url);
  if (error) {
    loginUrl.searchParams.set("error", error);
  }
  
  return NextResponse.redirect(loginUrl);
}
