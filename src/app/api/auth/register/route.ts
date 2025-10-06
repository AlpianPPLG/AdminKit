import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { hashPassword } from '@/lib/auth';
import { createUserSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createUserSchema.parse(body);
    const { name, email, password, role } = validatedData;

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

    // Create user with UUID
    const userId = crypto.randomUUID();
    await pool.execute(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role]
    );

    // Get created user (without password)
    const [newUser] = await pool.execute(
      'SELECT id, name, email, role, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    // Log the registration activity
    await pool.execute(
      'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
      [userId, 'REGISTER', `New user registered: ${name} (${email})`]
    );

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: (newUser as any[])[0],
    });
  } catch (error) {
    console.error('Registration error:', error);
    
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

