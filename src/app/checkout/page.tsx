'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useOrders } from '@/lib/orders-context';
import { usePaymentMethods } from '@/lib/payment-methods-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CreditCard, MapPin, User, Phone, Mail, CheckCircle, Plus, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutForm {
  shippingAddress: string;
  city: string;
  postalCode: string;
  phone: string;
  paymentMethod: string;
  selectedPaymentMethodId?: string;
  notes?: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { paymentMethods, loading: paymentMethodsLoading } = usePaymentMethods();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    shippingAddress: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: '',
    selectedPaymentMethodId: '',
    notes: ''
  });

  // Set loading to false when cart items are loaded
  useEffect(() => {
    setLoading(false);
  }, [cartItems]);

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 1000000) return 0;
    return 25000;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getDefaultPaymentMethod = () => {
    return paymentMethods.find(pm => pm.is_default);
  };

  const getCardTypeIcon = (provider: string) => {
    const lowerProvider = provider.toLowerCase();
    if (lowerProvider.includes('visa')) return '💳';
    if (lowerProvider.includes('mastercard') || lowerProvider.includes('master')) return '💳';
    if (lowerProvider.includes('amex') || lowerProvider.includes('american express')) return '💳';
    return '💳';
  };

  const formatCardNumber = (cardNumber?: string) => {
    if (!cardNumber) return '';
    return `****${cardNumber.slice(-4)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate form
    if (!form.shippingAddress || !form.city || !form.postalCode || !form.phone || !form.paymentMethod) {
      toast.error('Please fill in all required fields');
      return;
    }

    // If using saved payment method, validate selection
    if (form.paymentMethod === 'saved_payment_method' && !form.selectedPaymentMethodId) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);

    try {
      // Get payment method details
      let paymentMethodDetails = form.paymentMethod;
      if (form.paymentMethod === 'saved_payment_method' && form.selectedPaymentMethodId) {
        const selectedPM = paymentMethods.find(pm => pm.id === form.selectedPaymentMethodId);
        if (selectedPM) {
          paymentMethodDetails = `${selectedPM.provider} ${selectedPM.type.replace('_', ' ')} ${formatCardNumber(selectedPM.card_number)}`;
        }
      }

      // Create order
      const orderData = {
        total_amount: getTotal(),
        shipping_address: `${form.shippingAddress}, ${form.city}, ${form.postalCode}`,
        phone: form.phone,
        payment_method: paymentMethodDetails,
        notes: form.notes,
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price_per_unit: Number(item.product.price)
        }))
      };

      await createOrder(orderData);

      // Clear cart
      clearCart();
      
      toast.success('Order placed successfully!');
      router.push('/dashboard/my-orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading checkout...</p>
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
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-muted-foreground mb-4">You need to be logged in to checkout</p>
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
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some products to checkout</p>
            <Link href="/catalog">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingAddress">Address *</Label>
                      <Textarea
                        id="shippingAddress"
                        placeholder="Enter your full address"
                        value={form.shippingAddress}
                        onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Enter your city"
                        value={form.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        placeholder="Enter postal code"
                        value={form.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        value={form.paymentMethod}
                        onValueChange={(value) => {
                          handleInputChange('paymentMethod', value);
                          if (value !== 'saved_payment_method') {
                            handleInputChange('selectedPaymentMethodId', '');
                          } else {
                            // Set default payment method if available
                            const defaultPM = getDefaultPaymentMethod();
                            if (defaultPM) {
                              handleInputChange('selectedPaymentMethodId', defaultPM.id);
                            }
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.length > 0 && (
                            <SelectItem value="saved_payment_method">
                              Use Saved Payment Method
                            </SelectItem>
                          )}
                          <SelectItem value="credit_card">Credit Card (New)</SelectItem>
                          <SelectItem value="debit_card">Debit Card (New)</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="e_wallet">E-Wallet</SelectItem>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Saved Payment Methods */}
                    {form.paymentMethod === 'saved_payment_method' && paymentMethods.length > 0 && (
                      <div className="space-y-3">
                        <Label>Select Your Payment Method</Label>
                        {paymentMethods.map((pm) => (
                          <div
                            key={pm.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              form.selectedPaymentMethodId === pm.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => handleInputChange('selectedPaymentMethodId', pm.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">{getCardTypeIcon(pm.provider)}</div>
                                <div>
                                  <div className="font-medium">
                                    {pm.provider} {pm.type.replace('_', ' ')}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatCardNumber(pm.card_number)}
                                    {pm.expiry_month && pm.expiry_year && (
                                      <span> • Expires {pm.expiry_month}/{pm.expiry_year}</span>
                                    )}
                                  </div>
                                  {pm.holder_name && (
                                    <div className="text-sm text-muted-foreground">
                                      {pm.holder_name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {pm.is_default && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Default
                                  </Badge>
                                )}
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                  form.selectedPaymentMethodId === pm.id
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground'
                                }`}>
                                  {form.selectedPaymentMethodId === pm.id && (
                                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Payment Method Link */}
                    {form.paymentMethod !== 'saved_payment_method' && (
                      <div className="text-sm text-muted-foreground">
                        <Link href="/dashboard/payment-methods" className="text-primary hover:underline">
                          <Plus className="h-4 w-4 inline mr-1" />
                          Add a new payment method
                        </Link>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions for your order"
                        value={form.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                          <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
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

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    By placing this order, you agree to our terms and conditions
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
