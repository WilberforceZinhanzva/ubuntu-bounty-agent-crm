import { NextResponse } from 'next/server';
import { fieldAgentsQueries } from '../../../../lib/database-queries.js';

export async function GET(request, { params }) {
  try {
    const agent = await fieldAgentsQueries.getWithLeadsCount(params.id);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Get agent error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await fieldAgentsQueries.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete agent error:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}