'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
            <FileQuestion className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold">Page Not Found</CardTitle>
          <CardDescription className="text-lg mt-2">
            Oops! The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="text-7xl font-bold text-primary mb-2">404</div>
            <p className="text-muted-foreground">
              The requested URL was not found on this server.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            <p>Need help? Contact our support team or check our documentation.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}