import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Session token is required' }, { status: 400 });
    }

    // Validate sessionToken format (Base64-encoded 'id:timestamp')
    // Simple validation: must be a non-empty string without injection characters
    if (typeof sessionToken !== 'string' || sessionToken.length === 0 || sessionToken.includes('\n') || sessionToken.includes('\r')) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 400 });
    }

    // Set secure HTTP-only cookie with 24-hour expiration
    const response = NextResponse.redirect(new URL('/player', request.url), { status: 302 });
    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 86400, // 24 hours
      partitioned: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
