import { NextResponse } from 'next/server';
import { companySettingsQueries } from '../../../../lib/database-queries.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // In a real application, you would upload this to a cloud storage service
    // For now, we'll just return a placeholder URL
    const logoUrl = `/uploads/logo-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Save the logo URL to settings
    await companySettingsQueries.set('company_logo', logoUrl);

    return NextResponse.json({ logoUrl });
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload logo' },
      { status: 500 }
    );
  }
}