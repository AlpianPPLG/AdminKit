import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

// GET /api/media/[id] - Get media file by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [mediaFiles] = await pool.execute(`
      SELECT 
        m.*,
        u.name as uploaded_by_name,
        u.email as uploaded_by_email,
        u.role as uploaded_by_role
      FROM media_library m
      LEFT JOIN users u ON m.uploaded_by_user_id = u.id
      WHERE m.id = ?
    `, [id]);

    const fileList = mediaFiles as any[];
    if (fileList.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Media file not found' },
        { status: 404 }
      );
    }

    const file = fileList[0];

    return NextResponse.json({
      success: true,
      data: {
        ...file,
        uploaded_by: {
          name: file.uploaded_by_name,
          email: file.uploaded_by_email,
          role: file.uploaded_by_role,
        },
      },
    });
  } catch (error) {
    console.error('Get media file error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Delete media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if media file exists
    const [existingFiles] = await pool.execute(
      'SELECT id FROM media_library WHERE id = ?',
      [id]
    );

    if ((existingFiles as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Media file not found' },
        { status: 404 }
      );
    }

    // Delete media file
    await pool.execute('DELETE FROM media_library WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Media file deleted successfully',
    });
  } catch (error) {
    console.error('Delete media file error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

