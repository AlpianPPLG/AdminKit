'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

interface AccessDeniedProps {
  requiredRoles?: string[];
  currentRole?: string;
}

export function AccessDenied({ requiredRoles = [], currentRole }: AccessDeniedProps) {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to access this page.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Your role:</strong> {getRoleDisplayName(currentRole || user?.role || 'Unknown')}
            </p>
            {requiredRoles.length > 0 && (
              <p>
                <strong>Required roles:</strong> {requiredRoles.map(getRoleDisplayName).join(', ')}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout & Switch Account
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>Need admin access? Contact your system administrator.</p>
            <p className="mt-1">
              <strong>Demo accounts:</strong><br />
              Admin: admin@example.com / password123<br />
              Super Admin: admin@demo.com / password123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
