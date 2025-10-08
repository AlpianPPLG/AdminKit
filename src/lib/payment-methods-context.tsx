'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';

interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'E_WALLET' | 'BANK_TRANSFER';
  provider: string;
  card_number?: string;
  expiry_month?: number;
  expiry_year?: number;
  holder_name?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface PaymentMethodContextType {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  addPaymentMethod: (data: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePaymentMethod: (id: string, data: Partial<Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  setDefaultPaymentMethod: (id: string) => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export function PaymentMethodProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    if (!user) {
      setPaymentMethods([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/payment-methods?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setPaymentMethods(result.data || []);
      } else {
        console.error('Failed to fetch payment methods:', result.message);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load payment methods when user changes
  useEffect(() => {
    fetchPaymentMethods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addPaymentMethod = async (data: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchPaymentMethods(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to add payment method');
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  };

  const updatePaymentMethod = async (id: string, data: Partial<Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch('/api/payment-methods', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...data,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchPaymentMethods(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to update payment method');
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      const response = await fetch(`/api/payment-methods?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchPaymentMethods(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    try {
      await updatePaymentMethod(id, { is_default: true });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  };

  const refreshPaymentMethods = async () => {
    await fetchPaymentMethods();
  };

  return (
    <PaymentMethodContext.Provider
      value={{
        paymentMethods,
        loading,
        addPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
        refreshPaymentMethods,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  );
}

export function usePaymentMethods() {
  const context = useContext(PaymentMethodContext);
  if (context === undefined) {
    throw new Error('usePaymentMethods must be used within a PaymentMethodProvider');
  }
  return context;
}
