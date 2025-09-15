import { NextResponse } from 'next/server';
import { leadsQueries } from '../../../../../lib/database-queries.js';

export async function POST(request, { params }) {
  try {
    const { claimedBy } = await request.json();
    
    if (!claimedBy) {
      return NextResponse.json(
        { error: 'Claimed by name is required' },
        { status: 400 }
      );
    }

    const updatedLead = await leadsQueries.claim(params.id, claimedBy);
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Claim lead error:', error);
    return NextResponse.json(
      { error: 'Failed to claim lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const updatedLead = await leadsQueries.reverseClaim(params.id);
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Reverse claim error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse claim' },
      { status: 500 }
    );
  }
}