import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "NextAuth route works",
    timestamp: new Date().toISOString(),
    path: "/api/auth/test"
  });
}
