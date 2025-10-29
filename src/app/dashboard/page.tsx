'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { KPICard } from '@/components/dashboard/kpi-card';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useAuth } from '@/lib/auth-context';
import React, { useState, useEffect } from 'react';
import { useWishlist } from '@/lib/wishlist-context';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  Heart,
  CreditCard,
  History,
} from 'lucide-react';

// Admin Dashboard Component
function AdminDashboard() {
  const [, setLoading] = useState(true);
  const [overview, setOverview] = useState<{ totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number; avgOrderValue?: number; avgOrderValueChangePct?: number } | null>(null);
  const [charts, setCharts] = useState<{ monthlyRevenue: { month: string; revenue: number }[]; monthlyOrders: { month: string; orders: number }[]; topProducts: { id: string; name: string; price: number; total_sold: number }[] } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        const json = await res.json();
        if (json?.success) {
          setOverview(json.data.overview);
          setCharts(json.data.charts);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats().then(r => r);
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Users"
          value={overview?.totalUsers ?? '—'}
          change={{ value: 20.1, type: 'increase' }}
          icon={Users}
          description="Active users this month"
        />
        <KPICard
          title="Total Revenue"
          value={overview ? `Rp ${Number(overview.totalRevenue).toLocaleString('id-ID')}` : '—'}
          change={{ value: 12.5, type: 'increase' }}
          icon={DollarSign}
          description="Revenue this month"
        />
        <KPICard
          title="Products"
          value={overview?.totalProducts ?? '—'}
          change={{ value: 5.2, type: 'increase' }}
          icon={Package}
          description="Total products in catalog"
        />
        <KPICard
          title="Orders"
          value={overview?.totalOrders ?? '—'}
          change={{ value: 2.1, type: 'decrease' }}
          icon={ShoppingCart}
          description="Orders this month"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart monthlyRevenue={charts?.monthlyRevenue} monthlyOrders={charts?.monthlyOrders} topProducts={charts?.topProducts} />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Conversion Rate"
          value="3.2%"
          change={{ value: 0.5, type: 'increase' }}
          icon={TrendingUp}
          description="Website conversion rate"
          className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        />
        <KPICard
          title="Bounce Rate"
          value="42.1%"
          change={{ value: 2.3, type: 'decrease' }}
          icon={TrendingDown}
          description="Website bounce rate"
          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <KPICard
          title="Avg. Order Value"
          value={overview ? `Rp ${Number(overview.avgOrderValue || 0).toLocaleString('id-ID')}` : '—'}
          change={{
            value: Number(Math.abs(overview?.avgOrderValueChangePct ?? 0).toFixed(1)),
            type: (overview?.avgOrderValueChangePct ?? 0) >= 0 ? 'increase' : 'decrease',
          }}
          icon={DollarSign}
          description="Average order value (this month)"
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
      </div>
    </div>
  );
}

// Customer Dashboard Component
function CustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    overview: {
      totalOrders: number;
      totalSpent: number;
      paymentMethodsCount: number;
      profileCompleteness: number;
      loyaltyPoints: number;
      spendingChangePct: number;
    };
    recentOrders: Array<{
      id: string;
      amount: number;
      status: string;
      created_at: string;
      item_count: number;
    }>;
  } | null>(null);

  const { getWishlistCount } = useWishlist();

  useEffect(() => {
    const fetchCustomerStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/dashboard/customer', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json?.success) {
          setDashboardData(json.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerStats().then(r => r);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          Welcome back!
        </h2>
        <p className="text-blue-700 dark:text-blue-300 mt-2">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* Customer KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="My Orders"
          value={dashboardData?.overview.totalOrders ?? 0}
          change={{
            value: Math.abs(dashboardData?.overview.spendingChangePct ?? 0),
            type: (dashboardData?.overview.spendingChangePct ?? 0) >= 0 ? 'increase' : 'decrease'
          }}
          icon={ShoppingCart}
          description="Total orders placed"
        />
        <KPICard
          title="Total Spent"
          value={`Rp ${Number(dashboardData?.overview.totalSpent ?? 0).toLocaleString('id-ID')}`}
          change={{
            value: Math.abs(dashboardData?.overview.spendingChangePct ?? 0),
            type: (dashboardData?.overview.spendingChangePct ?? 0) >= 0 ? 'increase' : 'decrease'
          }}
          icon={DollarSign}
          description="Amount spent this year"
        />
        <KPICard
          title="Wishlist Items"
          value={getWishlistCount()}
          change={{ value: 5, type: 'increase' }}
          icon={Heart}
          description="Items saved for later"
        />
        <KPICard
          title="Payment Methods"
          value={dashboardData?.overview.paymentMethodsCount ?? 0}
          change={{ value: 0, type: 'increase' }}
          icon={CreditCard}
          description="Saved payment methods"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Recent Orders"
          value={dashboardData?.recentOrders.length ?? 0}
          change={{ value: 0, type: 'increase' }}
          icon={History}
          description="Orders in progress"
          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <KPICard
          title="Profile Complete"
          value={`${dashboardData?.overview?.profileCompleteness ?? 0}%`}
          change={{
            value: (dashboardData?.overview?.profileCompleteness ?? 0) > 75 ? 5 : -5,
            type: (dashboardData?.overview?.profileCompleteness ?? 0) > 75 ? 'increase' : 'decrease'
          }}
          icon={User}
          description="Profile completion"
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
        <KPICard
          title="Loyalty Points"
          value={dashboardData?.overview.loyaltyPoints ?? 0}
          change={{ value: 10, type: 'increase' }}
          icon={TrendingUp}
          description="Available points"
          className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
        />
      </div>

      {/* Recent Orders Section */}
      {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {dashboardData.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.item_count} items • {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp {Number(order.amount).toLocaleString('id-ID')}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();

  const getDashboardContent = () => {
    if (!user) return null;
    
    if (user.role === 'CUSTOMER') {
      return <CustomerDashboard />;
    } else {
      return <AdminDashboard />;
    }
  };

  const getDashboardTitle = () => {
    if (!user) return 'Dashboard';
    
    if (user.role === 'CUSTOMER') {
      return 'My Dashboard';
    } else {
      return 'Admin Dashboard';
    }
  };

  const getDashboardDescription = () => {
    if (!user) return 'Welcome to AdminKit Pro';
    
    if (user.role === 'CUSTOMER') {
      return 'Manage your account, orders, and preferences';
    } else {
      return 'Welcome to AdminKit Pro - Your comprehensive admin dashboard';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout
        title={getDashboardTitle()}
        description={getDashboardDescription()}
      >
        {getDashboardContent()}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
