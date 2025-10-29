/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCurrency } from '@/lib/use-currency';

export default function CartPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Set loading to false when cart items are loaded
  useEffect(() => {
    setLoading(false);
  }, [cartItems]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setUpdating(productId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateQuantity(productId, newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  const getSubtotal = () => {
    return getCartTotal();
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 1000000) return 0; // Free shipping over 1M
    return 25000; // 25k shipping
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 text-muted-foreground mx-auto mb-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to view your cart</p>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="h-16 w-16 text-muted-foreground mx-auto mb-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some products to get started</p>
            <Link href="/catalog">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/catalog">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in your cart
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg line-clamp-2">{item.product.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(item.product.price)}
                          </span>
                          <Badge variant={item.product.stock_quantity > 0 ? 'default' : 'destructive'}>
                            {item.product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={updating === item.product.id || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {updating === item.product.id ? '...' : item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={updating === item.product.id || item.quantity >= item.product.stock_quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({getItemCount()} items)</span>
                      <span>{formatPrice(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {getShipping() === 0 ? (
                          <Badge variant="secondary">FREE</Badge>
                        ) : (
                          formatPrice(getShipping())
                        )}
                      </span>
                    </div>
                    {getSubtotal() < 1000000 && (
                      <p className="text-sm text-muted-foreground">
                        Add {formatPrice(1000000 - getSubtotal())} more for free shipping
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>

                  <Link href="/checkout" className="w-full">
                    <Button className="w-full" size="lg">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="text-center">
                    <Link href="/catalog">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
