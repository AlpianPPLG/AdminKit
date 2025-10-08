/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Search, Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Mock wishlist data - in a real app, this would come from an API
const mockWishlistItems = [
  {
    id: '1',
    product: {
      id: 'prod-1',
      name: 'Laptop Pro 14 inch',
      description: 'High-performance laptop with 16GB RAM and 512GB SSD',
      price: 15000000,
      image_url: 'https://via.placeholder.com/300x200?text=Laptop+Pro',
      stock_quantity: 50,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
    added_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    product: {
      id: 'prod-2',
      name: 'Wireless Mouse Pro',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 350000,
      image_url: 'https://via.placeholder.com/300x200?text=Mouse+Pro',
      stock_quantity: 200,
      created_at: '2024-01-14T15:45:00Z',
      updated_at: '2024-01-14T15:45:00Z',
    },
    added_at: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    product: {
      id: 'prod-3',
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical keyboard with blue switches',
      price: 1200000,
      image_url: 'https://via.placeholder.com/300x200?text=Keyboard',
      stock_quantity: 75,
      created_at: '2024-01-13T09:20:00Z',
      updated_at: '2024-01-13T09:20:00Z',
    },
    added_at: '2024-01-13T09:20:00Z',
  },
];

export default function WishlistPage() {
  useAuth();
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = wishlistItems.filter(item =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemoveFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from wishlist');
  };

  const handleAddToCart = (product: { id: string; name: string; description: string; price: number; image_url: string; stock_quantity: number; }) => {
    // In a real app, this would add the item to cart
    toast.success(`${product.name} added to cart`);
  };

  const totalItems = wishlistItems.length;
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.product.price, 0);
  const inStockItems = wishlistItems.filter(item => item.product.stock_quantity > 0).length;
  const outOfStockItems = wishlistItems.filter(item => item.product.stock_quantity === 0).length;

  return (
    <ProtectedRoute>
      <DashboardLayout
        title="My Wishlist"
        description="Save items you love for later"
      >
        <div className="space-y-6">
          {/* Wishlist Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">Items in wishlist</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp {totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total wishlist value</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{inStockItems}</div>
                <p className="text-xs text-muted-foreground">Available now</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
                <p className="text-xs text-muted-foreground">Currently unavailable</p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search wishlist items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist Items */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No items found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Your wishlist is empty'}
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {item.product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.product.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        Rp {item.product.price.toLocaleString()}
                      </span>
                      <Badge 
                        variant={item.product.stock_quantity > 0 ? 'default' : 'destructive'}
                      >
                        {item.product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Added on {format(new Date(item.added_at), 'MMM dd, yyyy')}
                    </p>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={item.product.stock_quantity === 0}
                        onClick={() => handleAddToCart(item.product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
