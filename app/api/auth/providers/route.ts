import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

// Route explicite pour /api/auth/providers
// NextAuth devrait normalement gérer cela via [...nextauth], mais créons une route explicite pour debug
export async function GET() {
  try {
    // Retourner les providers depuis authOptions
    const providers = authOptions.providers.map((provider: any) => ({
      id: provider.id,
      name: provider.name,
      type: provider.type,
    }));
    
    return NextResponse.json({
      providers: providers.reduce((acc: any, provider: any) => {
        acc[provider.id] = {
          id: provider.id,
          name: provider.name,
          type: provider.type,
        };
        return acc;
      }, {}),
    });
  } catch (error: any) {
    console.error("[NextAuth Providers] Error:", error);
    return NextResponse.json(
      { error: "Failed to get providers", message: error.message },
      { status: 500 }
    );
  }
}
