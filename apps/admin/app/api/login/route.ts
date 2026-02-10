import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

const getBackendUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
    return apiUrl.replace(/\/api$/, '');
  }
  
  return process.env.BACKEND_URL || 'https://tallel-textile-j62y.vercel.app';
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur de connexion' }));
      return NextResponse.json(
        { error: error.message || 'Email ou mot de passe incorrect' },
        { status: response.status }
      );
    }

    const user = await response.json();

    // Créer un cookie de session simple avec timestamp pour gérer l'inactivité
    const sessionData = {
      id: user.id,
      email: user.email,
      role: user.role || 'admin',
      name: user.name,
      timestamp: Date.now(), // Ajouter un timestamp pour suivre la dernière activité
    };

    const sessionCookie = serialize('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 jours (mais le timeout d'inactivité sera géré côté client)
      path: '/',
    });

    const nextResponse = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        role: user.role || 'admin',
        name: user.name,
      }
    });

    nextResponse.headers.set('Set-Cookie', sessionCookie);

    return nextResponse;
  } catch (error: any) {
    console.error('[Login API] Error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}
