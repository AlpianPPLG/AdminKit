/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportSchema, type ReportInput } from '@/lib/validations';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Download, FileText, TrendingUp, Users, Package, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';

// Mock data for demonstration
const salesData = [
  { name: 'Jan', sales: 4000, orders: 24, users: 100 },
  { name: 'Feb', sales: 3000, orders: 13, users: 80 },
  { name: 'Mar', sales: 2000, orders: 98, users: 120 },
  { name: 'Apr', sales: 2780, orders: 39, users: 90 },
  { name: 'May', sales: 1890, orders: 48, users: 110 },
  { name: 'Jun', sales: 2390, orders: 38, users: 95 },
  { name: 'Jul', sales: 3490, orders: 43, users: 130 },
];

const productData = [
  { name: 'Laptop Pro', value: 400, color: '#0088FE' },
  { name: 'Wireless Mouse', value: 300, color: '#00C49F' },
  { name: 'Keyboard', value: 300, color: '#FFBB28' },
  { name: 'Monitor', value: 200, color: '#FF8042' },
  { name: 'Headphones', value: 100, color: '#8884D8' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Helpers to build datasets by report type
function getDataset(type: string) {
  switch (type) {
    case 'users':
      return salesData.map(d => ({ Month: d.name, Users: d.users }));
    case 'products':
      return productData.map(d => ({ Product: d.name, Value: d.value }));
    case 'orders':
      return salesData.map(d => ({ Month: d.name, Orders: d.orders }));
    case 'sales':
    default:
      return salesData.map(d => ({ Month: d.name, Sales: d.sales }));
  }
}

function downloadCSV(filename: string, rows: Record<string, string | number>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => String(r[h]).replaceAll('"', '""')).map(v => /[,\n"]/.test(v) ? `"${v}"` : v).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadPDF(filename: string, title: string, rows: Record<string, string | number>[]) {
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 16);
    doc.setFontSize(10);
    const headers = Object.keys(rows[0]);
    const startY = 24;
    let y = startY;
    const lineHeight = 6;
    // headers
    doc.text(headers.join('  |  '), 14, y);
    y += lineHeight;
    // rows
    rows.forEach(r => {
      const line = headers.map(h => String(r[h])).join('  |  ');
      if (y > 280) { doc.addPage(); y = 16; }
      doc.text(line, 14, y);
      y += lineHeight;
    });
    doc.save(filename);
  } catch (e) {
    // Fallback: open a print-friendly window
    const headers = Object.keys(rows[0]);
    const html = `<!doctype html><title>${title}</title><pre>${title}\n\n${headers.join('\t')}\n${rows.map(r => headers.map(h => r[h]).join('\t')).join('\n')}</pre>`;
    const w = window.open('about:blank', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
  }
}

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string>('sales');

  const form = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      type: 'sales',
      format: 'csv',
    },
  });

  const handleDownload = async (type: string, format: 'csv' | 'pdf') => {
    const data = getDataset(type);
    const filename = `${type}-report.${format}`;
    if (!data.length) {
      toast.error('No data to export');
      return;
    }
    if (format === 'csv') {
      downloadCSV(filename, data);
    } else {
      await downloadPDF(filename, `${type.toUpperCase()} REPORT`, data);
    }
    toast.success(`Downloading ${type} report as ${format.toUpperCase()}`);
  };

  const generateReport = async (data: ReportInput) => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dataset = getDataset(data.type);
      if (data.format === 'csv') {
        downloadCSV(`${data.type}-report.csv`, dataset);
      } else {
        await downloadPDF(`${data.type}-report.pdf`, `${data.type.toUpperCase()} REPORT`, dataset);
      }
      toast.success(`Report generated successfully! (${data.type} - ${data.format?.toUpperCase()})`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (type: string, format: string) => {
    handleDownload(type, format as 'csv' | 'pdf');
  };

  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout
        title="Reports & Analytics"
        description="Generate comprehensive reports and analytics"
      >
        <div className="space-y-6">
          {/* Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(generateReport)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...form.register('startDate')}
                      className={form.formState.errors.startDate ? 'border-red-500' : ''}
                    />
                    {form.formState.errors.startDate && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.startDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...form.register('endDate')}
                      className={form.formState.errors.endDate ? 'border-red-500' : ''}
                    />
                    {form.formState.errors.endDate && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.endDate.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Report Type</Label>
                    <Select
                      value={form.watch('type')}
                      onValueChange={(value) => form.setValue('type', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Report</SelectItem>
                        <SelectItem value="users">User Report</SelectItem>
                        <SelectItem value="products">Product Report</SelectItem>
                        <SelectItem value="orders">Order Report</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.type && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.type.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select
                      value={form.watch('format')}
                      onValueChange={(value) => form.setValue('format', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.format && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.format.message}
                      </p>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReport('sales')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Sales Report</p>
                    <p className="text-xs text-muted-foreground">Revenue & trends</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('sales', 'csv');
                  }}>
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('sales', 'pdf');
                  }}>
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReport('users')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">User Report</p>
                    <p className="text-xs text-muted-foreground">User analytics</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('users', 'csv');
                  }}>
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('users', 'pdf');
                  }}>
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReport('products')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Product Report</p>
                    <p className="text-xs text-muted-foreground">Product performance</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('products', 'csv');
                  }}>
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('products', 'pdf');
                  }}>
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReport('orders')}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Order Report</p>
                    <p className="text-xs text-muted-foreground">Order analytics</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('orders', 'csv');
                  }}>
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    downloadReport('orders', 'pdf');
                  }}>
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Product Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Product Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
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
              </CardContent>
            </Card>

            {/* Orders vs Users */}
            <Card>
              <CardHeader>
                <CardTitle>Orders vs Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

