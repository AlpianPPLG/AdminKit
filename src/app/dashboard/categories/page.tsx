'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function CategoriesPage() {
  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout title="Categories" description="Manage product categories">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Category management coming soon.</p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}


