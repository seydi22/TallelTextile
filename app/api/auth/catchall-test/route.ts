import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: "Catch-all route test",
    path: req.nextUrl.pathname,
    timestamp: new Date().toISOString()
  });
}
