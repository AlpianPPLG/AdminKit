/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/lib/use-currency';

// Mock data for demo
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Customer', status: 'Inactive' },
];

const mockProducts = [
  { id: 1, name: 'Laptop Pro 14"', price: 15000000, stock: 50, status: 'In Stock' },
  { id: 2, name: 'Wireless Mouse', price: 350000, stock: 200, status: 'In Stock' },
  { id: 3, name: 'Mechanical Keyboard', price: 1200000, stock: 0, status: 'Out of Stock' },
];

const mockOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 15700000, status: 'Completed', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 5700000, status: 'Processing', date: '2024-01-14' },
  { id: 'ORD-003', customer: 'Mike Johnson', amount: 2000000, status: 'Pending', date: '2024-01-13' },
];

export default function DemoPage() {
  const { formatCurrency: formatCurrencyHook } = useCurrency();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    { id: 'dashboard', title: 'Dashboard Overview', description: 'Real-time analytics and KPIs' },
    { id: 'users', title: 'User Management', description: 'Manage users and permissions' },
    { id: 'products', title: 'Product Catalog', description: 'Inventory and product management' },
    { id: 'orders', title: 'Order Processing', description: 'Track and manage orders' },
    { id: 'reports', title: 'Reports & Analytics', description: 'Generate insights and reports' },
  ];

  const handlePlayDemo = () => {
    setIsPlaying(true);
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < demoSteps.length) {
        setActiveTab(demoSteps[currentStep].id);
      } else {
        setIsPlaying(false);
        clearInterval(interval);
        setActiveTab('dashboard');
      }
    }, 3000);
  };

  const handleResetDemo = () => {
    setIsPlaying(false);
    setActiveTab('dashboard');
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyHook(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Inactive': 'secondary',
      'Completed': 'default',
      'Processing': 'secondary',
      'Pending': 'outline',
      'In Stock': 'default',
      'Out of Stock': 'destructive',
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AdminKit Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleResetDemo}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Demo
              </Button>
              <Button onClick={handlePlayDemo} disabled={isPlaying}>
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Auto Play Demo
                  </>
                )}
              </Button>
              <Button asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Experience AdminKit Pro&appos;s powerful features in action
          </p>
          <div className="flex justify-center space-x-2 mb-6">
            {demoSteps.map((step, index) => (
              <div
                key={step.id}
                className={`h-2 w-16 rounded-full transition-colors ${
                  activeTab === step.id ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Demo Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {demoSteps.map((step) => (
            <Button
              key={step.id}
              variant={activeTab === step.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(step.id)}
              className="mb-2"
            >
              {step.title}
            </Button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
                <p className="text-muted-foreground">Real-time analytics and key performance indicators</p>
              </div>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">2,350</p>
                        <p className="text-xs text-green-600">+20.1% from last month</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">Rp 45.2M</p>
                        <p className="text-xs text-green-600">+12.5% from last month</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Orders</p>
                        <p className="text-2xl font-bold">573</p>
                        <p className="text-xs text-red-600">-2.1% from last month</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Products</p>
                        <p className="text-2xl font-bold">1,234</p>
                        <p className="text-xs text-green-600">+5.2% from last month</p>
                      </div>
                      <Package className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Interactive charts and analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">User Management</h2>
                <p className="text-muted-foreground">Manage users, roles, and permissions</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Users ({mockUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{user.role}</Badge>
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Product Catalog</h2>
                <p className="text-muted-foreground">Manage your product inventory</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Products ({mockProducts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-medium">{formatCurrency(product.price)}</p>
                          {getStatusBadge(product.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Order Processing</h2>
                <p className="text-muted-foreground">Track and manage customer orders</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders ({mockOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.customer}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-medium">{formatCurrency(order.amount)}</p>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Reports & Analytics</h2>
                <p className="text-muted-foreground">Generate insights and detailed reports</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full justify-start">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Sales Report (PDF)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="mr-2 h-4 w-4" />
                        User Report (CSV)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="mr-2 h-4 w-4" />
                        Product Report (Excel)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Conversion Rate</span>
                          <span>3.2%</span>
                        </div>
                        <Progress value={32} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Customer Satisfaction</span>
                          <span>94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Revenue Growth</span>
                          <span>12.5%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Experience the full power of AdminKit Pro with a free trial
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
