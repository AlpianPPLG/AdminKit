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
      WHERE status = 'COMPLETED'
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

    // Average Order Value (AOV) - current month vs previous month
    const [aovCurrentResult] = await pool.execute(`
      SELECT COALESCE(AVG(total_amount), 0) as avg_value
      FROM orders
      WHERE status = 'COMPLETED'
        AND created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `);
    const avgOrderValueCurrent = (aovCurrentResult as any[])[0].avg_value as number;

    const [aovPrevResult] = await pool.execute(`
      SELECT COALESCE(AVG(total_amount), 0) as avg_value
      FROM orders
      WHERE status = 'COMPLETED'
        AND created_at >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 1 MONTH)
        AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `);
    const avgOrderValuePrev = (aovPrevResult as any[])[0].avg_value as number;
    const avgOrderValueChangePct = avgOrderValuePrev > 0
      ? ((avgOrderValueCurrent - avgOrderValuePrev) / avgOrderValuePrev) * 100
      : 0;

    // Build last 6 months calendar and left join aggregates to include months with zero
    const [monthlyRevenueResult] = await pool.execute(`
      WITH RECURSIVE months AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01') AS month_start
        UNION ALL
        SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
        FROM months
        WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      ), revenue_by_month AS (
        SELECT DATE_FORMAT(created_at, '%Y-%m-01') AS month_start,
               COALESCE(SUM(total_amount), 0) AS revenue
        FROM orders
        WHERE status = 'COMPLETED'
          AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-01')
      )
      SELECT DATE_FORMAT(m.month_start, '%Y-%m') AS month,
             COALESCE(r.revenue, 0) AS revenue
      FROM months m
      LEFT JOIN revenue_by_month r ON r.month_start = m.month_start
      ORDER BY m.month_start ASC
    `);
    const monthlyRevenue = monthlyRevenueResult as any[];

    const [monthlyOrdersResult] = await pool.execute(`
      WITH RECURSIVE months AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01') AS month_start
        UNION ALL
        SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
        FROM months
        WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      ), orders_by_month AS (
        SELECT DATE_FORMAT(created_at, '%Y-%m-01') AS month_start,
               COUNT(*) AS orders
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-01')
      )
      SELECT DATE_FORMAT(m.month_start, '%Y-%m') AS month,
             COALESCE(o.orders, 0) AS orders
      FROM months m
      LEFT JOIN orders_by_month o ON o.month_start = m.month_start
      ORDER BY m.month_start ASC
    `);
    const monthlyOrders = monthlyOrdersResult as any[];

    // Monthly new users (last 6 months)
    const [monthlyUsersResult] = await pool.execute(`
      WITH RECURSIVE months AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01') AS month_start
        UNION ALL
        SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
        FROM months
        WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      ), users_by_month AS (
        SELECT DATE_FORMAT(created_at, '%Y-%m-01') AS month_start,
               COUNT(*) AS users
        FROM users
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m-01')
      )
      SELECT DATE_FORMAT(m.month_start, '%Y-%m') AS month,
             COALESCE(u.users, 0) AS users
      FROM months m
      LEFT JOIN users_by_month u ON u.month_start = m.month_start
      ORDER BY m.month_start ASC
    `);
    const monthlyUsers = monthlyUsersResult as any[];

    // Get top selling products
    const [topProductsResult] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.price,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'COMPLETED'
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
          avgOrderValue: avgOrderValueCurrent,
          avgOrderValueChangePct,
        },
        charts: {
          monthlyRevenue,
          monthlyOrders,
          monthlyUsers,
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
