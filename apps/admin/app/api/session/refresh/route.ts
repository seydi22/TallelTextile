import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value);
      
      // Mettre à jour le timestamp
      const updatedSession = {
        ...sessionData,
        timestamp: Date.now(),
      };

      // Mettre à jour le cookie avec le nouveau timestamp
      const updatedCookie = serialize('admin_session', JSON.stringify(updatedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
        path: '/',
      });

      const response = NextResponse.json({ success: true });
      response.headers.set('Set-Cookie', updatedCookie);

      return response;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('[Session Refresh API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
