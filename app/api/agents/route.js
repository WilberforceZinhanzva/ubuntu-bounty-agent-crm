import { NextResponse } from 'next/server';
import { fieldAgentsQueries } from '../../../lib/database-queries.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let agents;

    if (location) {
      agents = await fieldAgentsQueries.getByLocation(location);
    } else if (startDate && endDate) {
      agents = await fieldAgentsQueries.getByDateRange(startDate, endDate);
    } else {
      agents = await fieldAgentsQueries.getAll();
    }

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Get agents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const agentData = await request.json();
    const newAgent = await fieldAgentsQueries.create(agentData);
    return NextResponse.json(newAgent, { status: 201 });
  } catch (error) {
    console.error('Create agent error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}