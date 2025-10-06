'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaymentMethodForm } from '@/components/payment-method-form';
import { useAuth } from '@/lib/auth-context';
import { usePaymentMethods } from '@/lib/payment-methods-context';
import { CreditCard, Plus, Edit, Trash2, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const { 
    paymentMethods, 
    loading, 
    addPaymentMethod, 
    updatePaymentMethod, 
    deletePaymentMethod, 
    setDefaultPaymentMethod 
  } = usePaymentMethods();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return '💳';
      case 'BANK_TRANSFER':
        return '🏦';
      case 'E_WALLET':
        return '📱';
      default:
        return '💳';
    }
  };

  const getPaymentTypeName = (type: string) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'Credit Card';
      case 'DEBIT_CARD':
        return 'Debit Card';
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      case 'E_WALLET':
        return 'E-Wallet';
      default:
        return 'Payment Method';
    }
  };

  const handleAddPaymentMethod = async (data: any) => {
    try {
      await addPaymentMethod(data);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdatePaymentMethod = async (data: any) => {
    try {
      await updatePaymentMethod(selectedMethod.id, data);
    } catch (error) {
      throw error;
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      await setDefaultPaymentMethod(methodId);
      toast.success('Default payment method updated');
    } catch (error) {
      toast.error('Failed to set default payment method');
    }
  };

  const handleDeleteMethod = async (methodId: string) => {
    try {
      await deletePaymentMethod(methodId);
      toast.success('Payment method removed');
    } catch (error) {
      toast.error('Failed to delete payment method');
    }
  };

  const handleEditMethod = (method: any) => {
    setSelectedMethod(method);
    setIsEditDialogOpen(true);
  };

  const totalMethods = paymentMethods.length;
  const defaultMethod = paymentMethods.find(method => method.is_default);
  const creditCards = paymentMethods.filter(method => 
    method.type === 'CREDIT_CARD' || method.type === 'DEBIT_CARD'
  ).length;
  const ewallets = paymentMethods.filter(method => method.type === 'E_WALLET').length;

  return (
    <ProtectedRoute>
      <DashboardLayout
        title="Payment Methods"
        description="Manage your payment methods and billing information"
      >
        <div className="space-y-6">
          {/* Payment Methods Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Methods</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMethods}</div>
                <p className="text-xs text-muted-foreground">Payment methods</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Default Method</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {defaultMethod ? `${defaultMethod.provider} ${getPaymentTypeName(defaultMethod.type)}` : 'None'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {defaultMethod ? `****${defaultMethod.card_number?.slice(-4) || '****'}` : 'No default set'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cards</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{creditCards}</div>
                <p className="text-xs text-muted-foreground">Credit/Debit cards</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">E-Wallets</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ewallets}</div>
                <p className="text-xs text-muted-foreground">Digital wallets</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Payment Method Button */}
          <div className="flex justify-end">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>

          {/* Payment Methods List */}
          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading payment methods...</p>
                </CardContent>
              </Card>
            ) : paymentMethods.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No payment methods</h3>
                  <p className="text-muted-foreground">
                    Add a payment method to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              paymentMethods.map((method) => (
                <Card key={method.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getPaymentTypeIcon(method.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{method.provider} {getPaymentTypeName(method.type)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {method.card_number ? `****${method.card_number.slice(-4)}` : '********'}
                            {method.expiry_month && method.expiry_year && ` • Expires ${method.expiry_month.toString().padStart(2, '0')}/${method.expiry_year}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added on {new Date(method.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.is_default && (
                          <Badge variant="default">Default</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMethod(method)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {!method.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(method.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Payment Method Forms */}
          <PaymentMethodForm
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            onSubmit={handleAddPaymentMethod}
            title="Add New Payment Method"
            description="Add a new payment method to your account."
          />

          <PaymentMethodForm
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedMethod(null);
            }}
            onSubmit={handleUpdatePaymentMethod}
            initialData={selectedMethod}
            title="Edit Payment Method"
            description="Update your payment method information."
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
