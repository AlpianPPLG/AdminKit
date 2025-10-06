import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { uploadMediaSchema } from '@/lib/validations';

// GET /api/media - Get all media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        m.*,
        u.name as uploaded_by_name,
        u.email as uploaded_by_email,
        u.role as uploaded_by_role
      FROM media_library m
      LEFT JOIN users u ON m.uploaded_by_user_id = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM media_library m';
    const params: any[] = [];

    if (search) {
      query += ' WHERE m.file_name LIKE ? OR m.file_type LIKE ?';
      countQuery += ' WHERE m.file_name LIKE ? OR m.file_type LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [mediaFiles] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, params.slice(0, search ? 2 : 0));
    const total = (countResult as any[])[0].total;

    // Transform the data to include user information
    const mediaFilesWithUser = (mediaFiles as any[]).map(file => ({
      ...file,
      uploaded_by: {
        name: file.uploaded_by_name,
        email: file.uploaded_by_email,
        role: file.uploaded_by_role,
      },
    }));

    return NextResponse.json({
      success: true,
      data: mediaFilesWithUser,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get media files error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/media - Upload new media file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = uploadMediaSchema.parse(body);
    const { file_name, file_url, file_type, file_size_kb, uploaded_by_user_id } = validatedData;

    // Create media file record
    const [result] = await pool.execute(
      'INSERT INTO media_library (file_name, file_url, file_type, file_size_kb, uploaded_by_user_id) VALUES (?, ?, ?, ?, ?)',
      [file_name, file_url, file_type, file_size_kb, uploaded_by_user_id]
    );

    const insertResult = result as any;
    const mediaId = insertResult.insertId;

    // Get created media file with user details
    const [newMediaFile] = await pool.execute(`
      SELECT 
        m.*,
        u.name as uploaded_by_name,
        u.email as uploaded_by_email,
        u.role as uploaded_by_role
      FROM media_library m
      LEFT JOIN users u ON m.uploaded_by_user_id = u.id
      WHERE m.id = ?
    `, [mediaId]);

    const file = (newMediaFile as any[])[0];

    return NextResponse.json({
      success: true,
      message: 'Media file uploaded successfully',
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
    console.error('Upload media file error:', error);
    
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

