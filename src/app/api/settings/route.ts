import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { updateSettingSchema } from '@/lib/validations';

// GET /api/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    const [settings] = await pool.execute(
      'SELECT * FROM settings ORDER BY setting_key'
    );

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = updateSettingSchema.parse(body);
    const { setting_key, setting_value, description } = validatedData;

    // Check if setting exists
    const [existingSettings] = await pool.execute(
      'SELECT setting_key FROM settings WHERE setting_key = ?',
      [setting_key]
    );

    if ((existingSettings as any[]).length > 0) {
      // Update existing setting
      await pool.execute(
        'UPDATE settings SET setting_value = ?, description = ? WHERE setting_key = ?',
        [setting_value, description || null, setting_key]
      );
    } else {
      // Create new setting
      await pool.execute(
        'INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
        [setting_key, setting_value, description || null]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
    });
  } catch (error) {
    console.error('Update setting error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

