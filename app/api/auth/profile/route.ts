import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode session token: Base64-encoded 'id:timestamp'
    let decodedToken: string;
    try {
      decodedToken = Buffer.from(sessionToken, 'base64').toString('utf-8');
    } catch {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });
    }

    const [userId] = decodedToken.split(':');
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session token format' }, { status: 401 });
    }

    // Import supabase dynamically at request time
    const { supabase } = await import('@/lib/supabase');

    // Query user from database
    const { data: user, error } = await supabase
      .from('music_streaming_app_zyqlf_users')
      .select('id, email, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
