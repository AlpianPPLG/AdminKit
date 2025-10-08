/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { z } from 'zod';

// Validation schemas
const createPaymentMethodSchema = z.object({
  type: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'E_WALLET', 'BANK_TRANSFER']),
  provider: z.string().min(1).max(50),
  card_number: z.string().optional(),
  expiry_month: z.number().min(1).max(12).optional(),
  expiry_year: z.number().min(new Date().getFullYear()).optional(),
  holder_name: z.string().min(1).max(100).optional(),
  is_default: z.boolean().optional(),
});

const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

// GET /api/payment-methods - Get user's payment methods
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const [paymentMethods] = await pool.execute(
      'SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [userId]
    );

    return NextResponse.json({
      success: true,
      data: paymentMethods,
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/payment-methods - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createPaymentMethodSchema.parse(body);
    const { type, provider, card_number, expiry_month, expiry_year, holder_name, is_default } = validatedData;

    // Get user ID from request (you might want to get this from auth token)
    const userId = body.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults first
    if (is_default) {
      await pool.execute(
        'UPDATE payment_methods SET is_default = FALSE WHERE user_id = ?',
        [userId]
      );
    }

    // Create payment method
    const [result] = await pool.execute(
      'INSERT INTO payment_methods (user_id, type, provider, card_number, expiry_month, expiry_year, holder_name, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, type, provider, card_number || null, expiry_month || null, expiry_year || null, holder_name || null, is_default || false]
    );

    const insertResult = result as any;
    const paymentMethodId = insertResult.insertId;

    // Get created payment method
    const [newPaymentMethod] = await pool.execute(
      'SELECT * FROM payment_methods WHERE id = ?',
      [paymentMethodId]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment method created successfully',
      data: (newPaymentMethod as any[])[0],
    });
  } catch (error) {
    console.error('Create payment method error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/payment-methods - Update payment method
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = updatePaymentMethodSchema.parse(updateData);

    // If setting as default, unset other defaults first
    if (validatedData.is_default) {
      const [existingMethod] = await pool.execute(
        'SELECT user_id FROM payment_methods WHERE id = ?',
        [id]
      );
      
      if ((existingMethod as any[]).length > 0) {
        const userId = (existingMethod as any[])[0].user_id;
        await pool.execute(
          'UPDATE payment_methods SET is_default = FALSE WHERE user_id = ? AND id != ?',
          [userId, id]
        );
      }
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues = [];
    
    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    updateValues.push(id);

    const [result] = await pool.execute(
      `UPDATE payment_methods SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const updateResult = result as any;
    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Payment method not found' },
        { status: 404 }
      );
    }

    // Get updated payment method
    const [updatedPaymentMethod] = await pool.execute(
      'SELECT * FROM payment_methods WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment method updated successfully',
      data: (updatedPaymentMethod as any[])[0],
    });
  } catch (error) {
    console.error('Update payment method error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/payment-methods - Delete payment method
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      'DELETE FROM payment_methods WHERE id = ?',
      [id]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Payment method not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
