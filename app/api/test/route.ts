import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "API routes work",
    timestamp: new Date().toISOString(),
    path: "/api/test"
  });
}
