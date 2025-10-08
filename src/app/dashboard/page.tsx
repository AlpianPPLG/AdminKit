'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { KPICard } from '@/components/dashboard/kpi-card';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { useAuth } from '@/lib/auth-context';
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
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Users"
          value="2,350"
          change={{ value: 20.1, type: 'increase' }}
          icon={Users}
          description="Active users this month"
        />
        <KPICard
          title="Total Revenue"
          value="Rp 45,231,890"
          change={{ value: 12.5, type: 'increase' }}
          icon={DollarSign}
          description="Revenue this month"
        />
        <KPICard
          title="Products"
          value="1,234"
          change={{ value: 5.2, type: 'increase' }}
          icon={Package}
          description="Total products in catalog"
        />
        <KPICard
          title="Orders"
          value="573"
          change={{ value: 2.1, type: 'decrease' }}
          icon={ShoppingCart}
          description="Orders this month"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart />
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
          value="Rp 1,234,567"
          change={{ value: 8.7, type: 'increase' }}
          icon={DollarSign}
          description="Average order value"
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
      </div>
    </div>
  );
}

// Customer Dashboard Component
function CustomerDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          Welcome back!
        </h2>
        <p className="text-blue-700 dark:text-blue-300 mt-2">
          Here&aposs;s what&aposs;s happening with your account today.
        </p>
      </div>

      {/* Customer KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="My Orders"
          value="12"
          change={{ value: 2, type: 'increase' }}
          icon={ShoppingCart}
          description="Total orders placed"
        />
        <KPICard
          title="Total Spent"
          value="Rp 2,450,000"
          change={{ value: 15.3, type: 'increase' }}
          icon={DollarSign}
          description="Amount spent this year"
        />
        <KPICard
          title="Wishlist Items"
          value="8"
          change={{ value: 1, type: 'increase' }}
          icon={Heart}
          description="Items saved for later"
        />
        <KPICard
          title="Payment Methods"
          value="3"
          change={{ value: 0, type: 'increase' }}
          icon={CreditCard}
          description="Saved payment methods"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Recent Orders"
          value="3"
          change={{ value: 0, type: 'increase' }}
          icon={History}
          description="Orders in progress"
          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900"
        />
        <KPICard
          title="Profile Complete"
          value="85%"
          change={{ value: 5, type: 'increase' }}
          icon={User}
          description="Profile completion"
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900"
        />
        <KPICard
          title="Loyalty Points"
          value="1,250"
          change={{ value: 50, type: 'increase' }}
          icon={TrendingUp}
          description="Available points"
          className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
        />
      </div>
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
