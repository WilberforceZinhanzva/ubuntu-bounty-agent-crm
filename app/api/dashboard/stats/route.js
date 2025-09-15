import { NextResponse } from 'next/server';
import { dashboardQueries } from '../../../../lib/database-queries.js';

export async function GET() {
  try {
    const stats = await dashboardQueries.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}