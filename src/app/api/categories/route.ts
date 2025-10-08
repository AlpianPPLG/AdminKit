/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET() {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, parent_id } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, parent_id) VALUES (?, ?, ?)',
      [name, description || null, parent_id || null]
    );

    const insertResult = result as any;
    const categoryId = insertResult.insertId;

    // Get created category
    const [newCategory] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: (newCategory as any[])[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}
