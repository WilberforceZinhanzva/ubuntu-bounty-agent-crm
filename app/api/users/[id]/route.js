import { NextResponse } from 'next/server';
import { systemUsersQueries } from '../../../../lib/database-queries.js';

export async function PUT(request, { params }) {
  try {
    const userData = await request.json();
    const updatedUser = await systemUsersQueries.update(params.id, userData);
    // Remove sensitive information
    const { login_pin, ...userWithoutPin } = updatedUser;
    return NextResponse.json(userWithoutPin);
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await systemUsersQueries.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}