'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { updateOrderSchema, type UpdateOrderInput } from '@/lib/validations';
import { Order, OrderItem, User, Product } from '@/lib/types';
import { Search, MoreHorizontal, Edit, Eye, Package, User as UserIcon, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface OrderWithDetails extends Order {
  user?: User;
  items?: (OrderItem & { product?: Product })[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Edit order form
  const editForm = useForm<UpdateOrderInput>({
    resolver: zodResolver(updateOrderSchema),
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      toast.error('An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order
  const onUpdateOrder = async (data: UpdateOrderInput) => {
    if (!selectedOrder) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: data.status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Order updated successfully');
        setIsEditDialogOpen(false);
        setSelectedOrder(null);
        editForm.reset();
        fetchOrders();
      } else {
        toast.error(result.message || 'Failed to update order');
      }
    } catch (error) {
      toast.error('An error occurred while updating order');
    }
  };

  // Open edit dialog
  const openEditDialog = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    editForm.reset({
      status: order.status,
      shipping_address: order.shipping_address || '',
    });
    setIsEditDialogOpen(true);
  };

  // Open view dialog
  const openViewDialog = (order: OrderWithDetails) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'PAID':
        return 'default';
      case 'SHIPPED':
        return 'default';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'PAID':
        return 'text-blue-600 dark:text-blue-400';
      case 'SHIPPED':
        return 'text-purple-600 dark:text-purple-400';
      case 'COMPLETED':
        return 'text-green-600 dark:text-green-400';
      case 'CANCELLED':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout
        title="Order Management"
        description="Manage customer orders and track their status"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
              <p className="text-muted-foreground">
                Manage customer orders and track their status
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading orders...
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{order.user?.name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.user?.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {format(new Date(order.order_date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openViewDialog(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(order)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Order Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Update the status and shipping information for this order.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={editForm.handleSubmit(onUpdateOrder)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editForm.watch('status')}
                    onValueChange={(value) => editForm.setValue('status', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {editForm.formState.errors.status && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.status.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_address">Shipping Address</Label>
                  <Textarea
                    id="shipping_address"
                    {...editForm.register('shipping_address')}
                    className={editForm.formState.errors.shipping_address ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {editForm.formState.errors.shipping_address && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.shipping_address.message}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Order</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* View Order Details Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Complete information about this order.
                </DialogDescription>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Order Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Order ID:</span> {selectedOrder.id}</p>
                        <p><span className="text-muted-foreground">Date:</span> {format(new Date(selectedOrder.order_date), 'PPP')}</p>
                        <p><span className="text-muted-foreground">Total:</span> {formatCurrency(selectedOrder.total_amount)}</p>
                        <p><span className="text-muted-foreground">Status:</span> 
                          <Badge variant={getStatusBadgeVariant(selectedOrder.status)} className="ml-2">
                            {selectedOrder.status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Name:</span> {selectedOrder.user?.name || 'Unknown'}</p>
                        <p><span className="text-muted-foreground">Email:</span> {selectedOrder.user?.email || 'No email'}</p>
                        <p><span className="text-muted-foreground">Role:</span> {selectedOrder.user?.role || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {selectedOrder.shipping_address && (
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address}</p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span>{item.product?.name || 'Unknown Product'}</span>
                                </div>
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency(item.price_per_unit)}</TableCell>
                              <TableCell className="font-medium">
                                {formatCurrency(item.price_per_unit * item.quantity)}
                              </TableCell>
                            </TableRow>
                          )) || (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4">
                                No items found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

