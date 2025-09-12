import { NextRequest, NextResponse } from 'next/server';

const BACKEND_ORIGIN =
  process.env.BACKEND_INTERNAL_ORIGIN ||
  (process.env.NEXT_PUBLIC_BACKEND_URL
    ? process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/?api\/?$/, '')
    : '') ||
  'http://127.0.0.1:10000';

// Force dynamic for standalone mode - required for server-side functionality
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    // Backend uses global '/api' prefix
    const response = await fetch(`${BACKEND_ORIGIN}/api/subscription/my-status`, {
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
