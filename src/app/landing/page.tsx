'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Settings,
  Shield,
  Zap,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'User Management',
      description: 'Complete user management with role-based access control and advanced permissions.',
      color: 'text-blue-600'
    },
    {
      icon: Package,
      title: 'Product Catalog',
      description: 'Manage your product inventory with detailed tracking and stock management.',
      color: 'text-green-600'
    },
    {
      icon: ShoppingCart,
      title: 'Order Processing',
      description: 'Streamlined order management with real-time status tracking and notifications.',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive analytics and reporting tools for data-driven decisions.',
      color: 'text-orange-600'
    },
    {
      icon: FileText,
      title: 'Media Library',
      description: 'Centralized media management with drag-and-drop file uploads.',
      color: 'text-pink-600'
    },
    {
      icon: Settings,
      title: 'System Settings',
      description: 'Flexible configuration options for customization and system preferences.',
      color: 'text-gray-600'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Orders Processed', value: '50,000+' },
    { label: 'Products Managed', value: '5,000+' },
    { label: 'Uptime', value: '99.9%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AdminKit Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            New: Advanced Analytics Dashboard
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            The Ultimate{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Streamline your business operations with our comprehensive, modular admin dashboard. 
            Built for modern teams who demand efficiency, flexibility, and powerful insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your business efficiently, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of businesses already using AdminKit Pro to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AdminKit Pro</span>
          </div>
          <p className="text-muted-foreground mb-4">
            The ultimate admin dashboard for modern businesses.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; 2024 AdminKit Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

