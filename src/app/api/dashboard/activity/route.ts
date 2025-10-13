/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        a.id,
        a.user_id,
        a.action,
        a.details,
        a.created_at,
        u.name as user_name,
        u.avatar_url as user_avatar
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT 15
    `);

    const activities = (rows as any[]).map((row) => ({
      id: row.id,
      user: {
        id: row.user_id,
        name: row.user_name,
        avatar_url: row.user_avatar,
      },
      action: row.action,
      details: row.details,
      created_at: row.created_at,
    }));

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch activity' },
      { status: 500 }
    );
  }
}


