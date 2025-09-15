import { NextResponse } from 'next/server';
import { companySettingsQueries } from '../../../lib/database-queries.js';

export async function GET() {
  try {
    const settings = await companySettingsQueries.getAll();
    const settingsObject = {};
    
    settings.forEach(setting => {
      settingsObject[setting.setting_key] = setting.setting_value;
    });

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { key, value } = await request.json();
    const setting = await companySettingsQueries.set(key, value);
    return NextResponse.json(setting);
  } catch (error) {
    console.error('Update setting error:', error);
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}