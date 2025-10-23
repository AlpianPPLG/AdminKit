import { type NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
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


    // Mark all notifications as read for the user
    await db.query(
      `UPDATE notifications 
       SET is_read = TRUE 
       WHERE (user_id = ? OR user_id IS NULL) AND is_read = FALSE`,
      [userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
