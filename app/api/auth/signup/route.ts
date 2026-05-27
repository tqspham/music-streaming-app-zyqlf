import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('music_streaming_app_zyqlf_users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('music_streaming_app_zyqlf_users')
      .insert([
        {
          email: email.toLowerCase(),
          password_hash: passwordHash,
        },
      ])
      .select('id, email')
      .single();

    if (error || !newUser) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    // Generate a mock session token
    const sessionToken = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

    return NextResponse.json(
      {
        sessionToken,
        userId: newUser.id,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
