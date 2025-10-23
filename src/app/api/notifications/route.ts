import { type NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { getToken } from 'next-auth/jwt';
import type { ResultSetHeader } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    // Check auth header first
    const authHeader = req.headers.get('authorization');
    let userId;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        // Verify JWT token and get user ID
        const decoded = await getToken({ req });
        userId = decoded?.sub;
      } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      // Fallback to session-based auth
      const token = await getToken({ req });
      userId = token?.sub;
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [rows] = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = ? OR user_id IS NULL 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    return NextResponse.json({ notifications: rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create notification - this will be called internally by other APIs
export async function POST(req: NextRequest) {
  try {
    // Check auth header first
    const authHeader = req.headers.get('authorization');
    let decoded;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        decoded = await getToken({ req });
      } catch (error) {
        console.error('Token verification failed:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      // Fallback to session-based auth
      decoded = await getToken({ req });
    }

    if (!decoded?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { type, title, message, userId, link } = await req.json();

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO notifications (type, title, message, user_id, link) 
       VALUES (?, ?, ?, ?, ?)`,
      [type, title, message, userId, link]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
