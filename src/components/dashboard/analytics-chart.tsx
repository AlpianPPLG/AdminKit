'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const defaultSalesData = [
  { name: 'Jan', value: 0, orders: 0 },
  { name: 'Feb', value: 0, orders: 0 },
  { name: 'Mar', value: 0, orders: 0 },
  { name: 'Apr', value: 0, orders: 0 },
  { name: 'May', value: 0, orders: 0 },
  { name: 'Jun', value: 0, orders: 0 },
  { name: 'Jul', value: 0, orders: 0 },
];

const userData = [
  { name: 'Jan', users: 400, newUsers: 240 },
  { name: 'Feb', users: 300, newUsers: 139 },
  { name: 'Mar', users: 200, newUsers: 980 },
  { name: 'Apr', users: 278, newUsers: 390 },
  { name: 'May', users: 189, newUsers: 480 },
  { name: 'Jun', users: 239, newUsers: 380 },
  { name: 'Jul', users: 349, newUsers: 430 },
];

const defaultProductData = [
  { name: '—', value: 0, color: '#0088FE' },
];

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f97316', '#a78bfa', '#f472b6'];

interface AnalyticsChartProps {
  monthlyRevenue?: { month: string; revenue: number }[];
  monthlyOrders?: { month: string; orders: number }[];
  topProducts?: { id: string; name: string; price: number; total_sold: number }[];
}

export function AnalyticsChart({ monthlyRevenue, monthlyOrders, topProducts }: AnalyticsChartProps) {
  const salesData = (monthlyRevenue && monthlyRevenue.length > 0
    ? monthlyRevenue
    : []
  ).map((m) => ({ name: m.month, value: Number(m.revenue) || 0, orders: 0 })) || defaultSalesData;

  const ordersData = (monthlyOrders && monthlyOrders.length > 0
    ? monthlyOrders
    : []
  ).map((m) => ({ name: m.month, orders: Number(m.orders) || 0 })) as { name: string; orders: number }[];

  const productData = (topProducts && topProducts.length > 0
    ? topProducts
    : []
  ).map((p) => ({ name: p.name, value: Number(p.total_sold) || 0, color: '#8884d8' })) || defaultProductData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#82ca9d"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData?.length ? ordersData : [{ name: '—', orders: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}`, 'Total Sold']} />
                  <Legend verticalAlign="bottom" height={24} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

