import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const MOCK_USERS: Record<string, { id: string; email: string; passwordHash: string }> = {
  'user@example.com': {
    id: 'user-1',
    email: 'user@example.com',
    passwordHash: '$2a$10$TLWu2VQo/ZCNZ9mD5JLdE.d5HjvXiHXA5Ej3YxYGQeUCaLZVqJwAm',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (MOCK_USERS[email]) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    MOCK_USERS[email] = {
      id: userId,
      email,
      passwordHash,
    };

    const sessionToken = Buffer.from(`${userId}:${Date.now()}`).toString('base64');

    return NextResponse.json(
      {
        sessionToken,
        userId,
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
