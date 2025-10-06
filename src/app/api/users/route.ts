import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { hashPassword } from '@/lib/auth';
import { createUserSchema } from '@/lib/validations';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    const params: any[] = [];

    if (search) {
      query += ' WHERE name LIKE ? OR email LIKE ?';
      countQuery += ' WHERE name LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [users] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, params.slice(0, search ? 2 : 0));
    const total = (countResult as any[])[0].total;

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createUserSchema.parse(body);
    const { name, email, password, role, avatar_url } = validatedData;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role, avatar_url || null]
    );

    const insertResult = result as any;
    const userId = insertResult.insertId;

    // Get created user
    const [newUser] = await pool.execute(
      'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: (newUser as any[])[0],
    });
  } catch (error) {
    console.error('Create user error:', error);
    
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

