import { NextResponse } from 'next/server';
import { leadsQueries } from '../../../../lib/database-queries.js';

export async function DELETE(request, { params }) {
  try {
    await leadsQueries.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}