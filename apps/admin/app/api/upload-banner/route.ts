import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy d'upload de bannière vers le backend.
 * Permet d'éviter les problèmes de CORS et d'URL relative côté client.
 */
export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '').replace(/\/api$/, '')
    || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');

  if (!baseUrl) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_API_BASE_URL non configuré. Configurez cette variable dans les paramètres Vercel.' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const uploadUrl = `${baseUrl}/api/main-image`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, fetch le fera automatiquement avec le boundary
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        data || { error: `Erreur ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('[upload-banner] Erreur:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}
