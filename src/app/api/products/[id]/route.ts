import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { updateProductSchema } from '@/lib/validations';

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    const productList = products as any[];
    if (productList.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: productList[0],
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate input
    const validatedData = updateProductSchema.parse(body);
    const { name, description, price, stock_quantity, image_url } = validatedData;

    // Check if product exists
    const [existingProducts] = await pool.execute(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if ((existingProducts as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description || null);
    }
    if (price !== undefined) {
      updateFields.push('price = ?');
      updateValues.push(price);
    }
    if (stock_quantity !== undefined) {
      updateFields.push('stock_quantity = ?');
      updateValues.push(stock_quantity);
    }
    if (image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(image_url || null);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(query, updateValues);

    // Get updated product
    const [updatedProducts] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: (updatedProducts as any[])[0],
    });
  } catch (error) {
    console.error('Update product error:', error);
    
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

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if product exists
    const [existingProducts] = await pool.execute(
      'SELECT id FROM products WHERE id = ?',
      [id]
    );

    if ((existingProducts as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is in any orders
    const [orderItems] = await pool.execute(
      'SELECT id FROM order_items WHERE product_id = ? LIMIT 1',
      [id]
    );

    if ((orderItems as any[]).length > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete product that is part of existing orders' },
        { status: 400 }
      );
    }

    // Delete product
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

