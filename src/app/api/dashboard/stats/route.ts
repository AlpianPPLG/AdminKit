/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET() {
  try {
    // Get total users
    const [usersResult] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const totalUsers = (usersResult as any[])[0].count;

    // Get total products
    const [productsResult] = await pool.execute('SELECT COUNT(*) as count FROM products');
    const totalProducts = (productsResult as any[])[0].count;

    // Get total orders
    const [ordersResult] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const totalOrders = (ordersResult as any[])[0].count;

    // Get total revenue
    const [revenueResult] = await pool.execute(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue 
      FROM orders 
      WHERE status = 'completed'
    `);
    const totalRevenue = (revenueResult as any[])[0].total_revenue;

    // Get recent orders (last 7 days)
    const [recentOrdersResult] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const recentOrders = (recentOrdersResult as any[])[0].count;

    // Get low stock products
    const [lowStockResult] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM products 
      WHERE stock_quantity <= 10
    `);
    const lowStockProducts = (lowStockResult as any[])[0].count;

    // Get monthly revenue for chart (last 6 months)
    const [monthlyRevenueResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders 
      WHERE status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);
    const monthlyRevenue = monthlyRevenueResult as any[];

    // Get top selling products
    const [topProductsResult] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.price,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
      GROUP BY p.id, p.name, p.price
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    const topProducts = topProductsResult as any[];

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalRevenue,
          recentOrders,
          lowStockProducts,
        },
        charts: {
          monthlyRevenue,
          topProducts,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
