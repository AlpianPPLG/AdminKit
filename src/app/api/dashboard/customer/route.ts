/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { extractTokenFromHeaders, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeaders(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // Get user's total orders
    const [ordersResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
      [userId]
    );
    const totalOrders = (ordersResult as any[])[0].count;

    // Get user's total spent (completed orders)
    const [spentResult] = await pool.execute(`
      SELECT COALESCE(SUM(total_amount), 0) as total_spent
      FROM orders
      WHERE user_id = ? AND status = 'COMPLETED'
    `, [userId]);
    const totalSpent = (spentResult as any[])[0].total_spent;

    // Get user's wishlist items count
    const [wishlistResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?',
      [userId]
    );
    const wishlistCount = (wishlistResult as any[])[0].count;

    // Get user's payment methods count
    const [paymentMethodsResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM payment_methods WHERE user_id = ?',
      [userId]
    );
    const paymentMethodsCount = (paymentMethodsResult as any[])[0].count;

    // Get user's recent orders (last 5)
    const [recentOrdersResult] = await pool.execute(`
      SELECT
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id, o.total_amount, o.status, o.created_at
      ORDER BY o.created_at DESC
      LIMIT 5
    `, [userId]);
    const recentOrders = recentOrdersResult as any[];

    // Get user's profile completeness (basic check)
    const [userResult] = await pool.execute(
      'SELECT name, email, avatar_url FROM users WHERE id = ?',
      [userId]
    );
    const user = (userResult as any[])[0];

    let profileCompleteness = 0;
    if (user.name) profileCompleteness += 25;
    if (user.email) profileCompleteness += 25;
    if (user.avatar_url) profileCompleteness += 25;
    if (paymentMethodsCount > 0) profileCompleteness += 25;

    // Calculate this month's spending vs last month
    const [currentMonthSpent] = await pool.execute(`
      SELECT COALESCE(SUM(total_amount), 0) as spent
      FROM orders
      WHERE user_id = ?
        AND status = 'COMPLETED'
        AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `, [userId]);

    const [lastMonthSpent] = await pool.execute(`
      SELECT COALESCE(SUM(total_amount), 0) as spent
      FROM orders
      WHERE user_id = ?
        AND status = 'COMPLETED'
        AND created_at >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
        AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `, [userId]);

    const currentMonthAmount = (currentMonthSpent as any[])[0].spent;
    const lastMonthAmount = (lastMonthSpent as any[])[0].spent;
    const spendingChangePct = lastMonthAmount > 0
      ? ((currentMonthAmount - lastMonthAmount) / lastMonthAmount) * 100
      : 0;

    // Get user's loyalty points (mock calculation based on orders)
    const loyaltyPoints = Math.floor(totalSpent / 10000) * 10; // 10 points per 10k spent

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalSpent,
          wishlistCount,
          paymentMethodsCount,
          profileCompleteness,
          loyaltyPoints,
          spendingChangePct,
        },
        recentOrders: recentOrders.map(order => ({
          id: order.id,
          amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          item_count: order.item_count,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching customer dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
