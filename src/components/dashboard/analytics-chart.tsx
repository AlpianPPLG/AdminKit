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
} from 'recharts';

const salesData = [
  { name: 'Jan', value: 4000, orders: 24 },
  { name: 'Feb', value: 3000, orders: 13 },
  { name: 'Mar', value: 2000, orders: 98 },
  { name: 'Apr', value: 2780, orders: 39 },
  { name: 'May', value: 1890, orders: 48 },
  { name: 'Jun', value: 2390, orders: 38 },
  { name: 'Jul', value: 3490, orders: 43 },
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

const productData = [
  { name: 'Laptop Pro', value: 400, color: '#0088FE' },
  { name: 'Wireless Mouse', value: 300, color: '#00C49F' },
  { name: 'Keyboard', value: 300, color: '#FFBB28' },
  { name: 'Monitor', value: 200, color: '#FF8042' },
  { name: 'Headphones', value: 100, color: '#8884D8' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsChart() {
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
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#8884d8" />
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
                    label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

