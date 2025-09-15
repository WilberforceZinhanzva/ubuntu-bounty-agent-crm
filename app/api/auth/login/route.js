import { NextResponse } from 'next/server';
import { systemUsersQueries } from '../../../../lib/database-queries.js';

export async function POST(request) {
  try {
    const { email, pin } = await request.json();

    if (!email || !pin) {
      return NextResponse.json(
        { error: 'Email and PIN are required' },
        { status: 400 }
      );
    }

    const user = await systemUsersQueries.authenticate(email, pin);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove sensitive information
    const { login_pin, ...userWithoutPin } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPin
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}