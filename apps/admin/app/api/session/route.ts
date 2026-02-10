import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({ session: null });
    }

    try {
      const session = JSON.parse(sessionCookie.value);
      return NextResponse.json({ session });
    } catch (error) {
      // Cookie invalide, le supprimer
      const response = NextResponse.json({ session: null });
      response.cookies.delete('admin_session');
      return response;
    }
  } catch (error: any) {
    console.error('[Session API] Error:', error);
    return NextResponse.json({ session: null });
  }
}
