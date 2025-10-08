/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { createProductSchema } from '@/lib/validations';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) as total FROM products';
    const params: any[] = [];

    if (search) {
      query += ' WHERE name LIKE ? OR description LIKE ?';
      countQuery += ' WHERE name LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [products] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, params.slice(0, search ? 2 : 0));
    const total = (countResult as any[])[0].total;

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createProductSchema.parse(body);
    const { name, description, price, stock_quantity, image_url } = validatedData;

    // Create product
    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description || null, price, stock_quantity, image_url || null]
    );

    const insertResult = result as any;
    const productId = insertResult.insertId;

    // Get created product
    const [newProduct] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: (newProduct as any[])[0],
    });
  } catch (error) {
    console.error('Create product error:', error);
    
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

