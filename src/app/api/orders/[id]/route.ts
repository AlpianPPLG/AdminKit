/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { updateOrderSchema } from '@/lib/validations';

// GET /api/orders/[id] - Get order by ID with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get order with user details
    const [orders] = await pool.execute(`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        u.avatar_url as user_avatar_url
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    const orderList = orders as any[];
    if (orderList.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderList[0];

    // Get order items with product details
    const [items] = await pool.execute(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description,
        p.image_url as product_image_url,
        p.price as product_current_price
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    const orderWithDetails = {
      ...order,
      user: {
        name: order.user_name,
        email: order.user_email,
        role: order.user_role,
        avatar_url: order.user_avatar_url,
      },
      items: items,
    };

    return NextResponse.json({
      success: true,
      data: orderWithDetails,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const validatedData = updateOrderSchema.parse(body);
    const { status, shipping_address } = validatedData;

    // Check if order exists
    const [existingOrders] = await pool.execute(
      'SELECT id FROM orders WHERE id = ?',
      [id]
    );

    if ((existingOrders as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (shipping_address !== undefined) {
      updateFields.push('shipping_address = ?');
      updateValues.push(shipping_address || null);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    updateValues.push(id);

    const query = `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(query, updateValues);

    // Get updated order with details
    const [updatedOrders] = await pool.execute(`
      SELECT 
        o.*,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    const order = (updatedOrders as any[])[0];

    // Get order items
    const [items] = await pool.execute(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.description as product_description,
        p.image_url as product_image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);

    const orderWithDetails = {
      ...order,
      user: {
        name: order.user_name,
        email: order.user_email,
        role: order.user_role,
      },
      items: items,
    };

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: orderWithDetails,
    });
  } catch (error) {
    console.error('Update order error:', error);
    
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

