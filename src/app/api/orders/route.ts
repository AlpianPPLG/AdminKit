import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { z } from 'zod';
import { createOrderSchema } from '@/lib/validations';
import { randomUUID } from 'crypto';

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED']),
});

// GET /api/orders - Get orders (with optional user_id filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM orders o';
    const params: any[] = [];
    const conditions: string[] = [];

    if (userId) {
      conditions.push('o.user_id = ?');
      params.push(userId);
    }

    if (status && status !== 'all') {
      conditions.push('o.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [orders] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, params.slice(0, conditions.length));
    const total = (countResult as any[])[0].total;

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      (orders as any[]).map(async (order) => {
        const [items] = await pool.execute(
          `SELECT 
            oi.*,
            p.name as product_name,
            p.image_url as product_image
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?`,
          [order.id]
        );
        return {
          ...order,
          items: items,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: ordersWithItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const body = await request.json();
    
    // Validate input
    const validatedData = createOrderSchema.parse(body);
    const { user_id, total_amount, shipping_address, phone, payment_method, notes, items } = validatedData;

    // Generate order ID
    const orderId = randomUUID();

    // Create order
    await connection.execute(
      `INSERT INTO orders (id, user_id, total_amount, shipping_address, phone, payment_method, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [orderId, user_id, total_amount, shipping_address, phone, payment_method, notes || null]
    );

    // Create order items
    for (const item of items) {
      const orderItemId = randomUUID();
      await connection.execute(
        'INSERT INTO order_items (id, order_id, product_id, quantity, price_per_unit) VALUES (?, ?, ?, ?, ?)',
        [orderItemId, orderId, item.product_id, item.quantity, item.price_per_unit]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    // Get created order with items
    const [newOrder] = await connection.execute(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?`,
      [orderId]
    );

    const [orderItems] = await connection.execute(
      `SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`,
      [orderId]
    );

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: {
        ...(newOrder as any[])[0],
        items: orderItems,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    
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
  } finally {
    connection.release();
  }
}

// PUT /api/orders - Update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = updateOrderStatusSchema.parse(updateData);

    const [result] = await pool.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [validatedData.status, id]
    );

    const updateResult = result as any;
    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Get updated order
    const [updatedOrder] = await pool.execute(
      `SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: (updatedOrder as any[])[0],
    });
  } catch (error) {
    console.error('Update order error:', error);
    
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

// DELETE /api/orders - Delete order
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}