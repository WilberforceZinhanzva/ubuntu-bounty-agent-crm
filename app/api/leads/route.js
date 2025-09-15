import { NextResponse } from 'next/server';
import { leadsQueries } from '../../../lib/database-queries.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const agentId = searchParams.get('agentId');
    const claimed = searchParams.get('claimed');

    let leads;

    if (search) {
      leads = await leadsQueries.search(search);
    } else if (startDate && endDate) {
      leads = await leadsQueries.getByDateRange(startDate, endDate);
    } else if (agentId) {
      leads = await leadsQueries.getByAgent(agentId);
    } else if (claimed === 'true') {
      leads = await leadsQueries.getClaimed();
    } else {
      leads = await leadsQueries.getAllWithAgents();
    }

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const leadData = await request.json();
    const newLead = await leadsQueries.create(leadData);
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}