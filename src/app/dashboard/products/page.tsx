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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, updateProductSchema, type CreateProductInput, type UpdateProductInput } from '@/lib/validations';
import { Product } from '@/lib/types';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Image from 'next/image';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Create product form
  const createForm = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      image_url: '',
    },
  });

  // Edit product form
  const editForm = useForm<UpdateProductInput>({
    resolver: zodResolver(updateProductSchema),
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error('An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Create product
  const onCreateProduct = async (data: CreateProductInput) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product created successfully');
        setIsCreateDialogOpen(false);
        createForm.reset();
        fetchProducts();
      } else {
        toast.error(result.message || 'Failed to create product');
      }
    } catch (error) {
      toast.error('An error occurred while creating product');
    }
  };

  // Update product
  const onUpdateProduct = async (data: UpdateProductInput) => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product updated successfully');
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        editForm.reset();
        fetchProducts();
      } else {
        toast.error(result.message || 'Failed to update product');
      }
    } catch (error) {
      toast.error('An error occurred while updating product');
    }
  };

  // Delete product
  const onDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Product deleted successfully');
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
        fetchProducts();
      } else {
        toast.error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('An error occurred while deleting product');
    }
  };

  // Open edit dialog
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    editForm.reset({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      image_url: product.image_url || '',
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'Out of Stock', variant: 'destructive' as const };
    if (quantity < 10) return { status: 'Low Stock', variant: 'secondary' as const };
    return { status: 'In Stock', variant: 'default' as const };
  };

  return (
    <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout
        title="Product Management"
        description="Manage your product catalog and inventory"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Products</h2>
              <p className="text-muted-foreground">
                Manage your product catalog and inventory
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                  <DialogDescription>
                    Add a new product to your catalog.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={createForm.handleSubmit(onCreateProduct)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        {...createForm.register('name')}
                        className={createForm.formState.errors.name ? 'border-red-500' : ''}
                      />
                      {createForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {createForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (IDR)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...createForm.register('price', { valueAsNumber: true })}
                        className={createForm.formState.errors.price ? 'border-red-500' : ''}
                      />
                      {createForm.formState.errors.price && (
                        <p className="text-sm text-red-500">
                          {createForm.formState.errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...createForm.register('description')}
                      className={createForm.formState.errors.description ? 'border-red-500' : ''}
                      rows={3}
                    />
                    {createForm.formState.errors.description && (
                      <p className="text-sm text-red-500">
                        {createForm.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity">Stock Quantity</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        {...createForm.register('stock_quantity', { valueAsNumber: true })}
                        className={createForm.formState.errors.stock_quantity ? 'border-red-500' : ''}
                      />
                      {createForm.formState.errors.stock_quantity && (
                        <p className="text-sm text-red-500">
                          {createForm.formState.errors.stock_quantity.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <Input
                        id="image_url"
                        type="url"
                        {...createForm.register('image_url')}
                        className={createForm.formState.errors.image_url ? 'border-red-500' : ''}
                      />
                      {createForm.formState.errors.image_url && (
                        <p className="text-sm text-red-500">
                          {createForm.formState.errors.image_url.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Product</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock_quantity);
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                {product.image_url ? (
                                  <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                {product.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <span className="font-medium">{product.stock_quantity}</span>
                              <Badge variant={stockStatus.variant} className="w-fit">
                                {stockStatus.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(product.created_at), 'MMM dd, yyyy')}
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
                                <DropdownMenuItem onClick={() => openEditDialog(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDeleteDialog(product)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update product information and inventory.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={editForm.handleSubmit(onUpdateProduct)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                      id="edit-name"
                      {...editForm.register('name')}
                      className={editForm.formState.errors.name ? 'border-red-500' : ''}
                    />
                    {editForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {editForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price (IDR)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      {...editForm.register('price', { valueAsNumber: true })}
                      className={editForm.formState.errors.price ? 'border-red-500' : ''}
                    />
                    {editForm.formState.errors.price && (
                      <p className="text-sm text-red-500">
                        {editForm.formState.errors.price.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    {...editForm.register('description')}
                    className={editForm.formState.errors.description ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {editForm.formState.errors.description && (
                    <p className="text-sm text-red-500">
                      {editForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-stock_quantity">Stock Quantity</Label>
                    <Input
                      id="edit-stock_quantity"
                      type="number"
                      {...editForm.register('stock_quantity', { valueAsNumber: true })}
                      className={editForm.formState.errors.stock_quantity ? 'border-red-500' : ''}
                    />
                    {editForm.formState.errors.stock_quantity && (
                      <p className="text-sm text-red-500">
                        {editForm.formState.errors.stock_quantity.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-image_url">Image URL</Label>
                    <Input
                      id="edit-image_url"
                      type="url"
                      {...editForm.register('image_url')}
                      className={editForm.formState.errors.image_url ? 'border-red-500' : ''}
                    />
                    {editForm.formState.errors.image_url && (
                      <p className="text-sm text-red-500">
                        {editForm.formState.errors.image_url.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Product</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Product Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this product? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              {selectedProduct && (
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">
                    Product: <span className="font-medium">{selectedProduct.name}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Price: <span className="font-medium">{formatCurrency(selectedProduct.price)}</span>
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={onDeleteProduct}>
                  Delete Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

