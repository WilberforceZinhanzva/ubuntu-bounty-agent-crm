import { NextResponse } from 'next/server';
import { systemUsersQueries } from '../../../lib/database-queries.js';

export async function GET() {
  try {
    const users = await systemUsersQueries.getAll();
    // Remove sensitive information
    const usersWithoutPins = users.map(({ login_pin, ...user }) => user);
    return NextResponse.json(usersWithoutPins);
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userData = await request.json();
    const newUser = await systemUsersQueries.create(userData);
    // Remove sensitive information
    const { login_pin, ...userWithoutPin } = newUser;
    return NextResponse.json(userWithoutPin, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}