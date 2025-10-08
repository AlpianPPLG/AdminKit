'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
  product_name?: string;
  product_image?: string;
}

interface Order {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  shipping_address: string;
  phone: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  items: OrderItem[];
}

interface OrderContextType {
  orders: Order[];
  loading: boolean;
  createOrder: (orderData: {
    total_amount: number;
    shipping_address: string;
    phone: string;
    payment_method: string;
    notes?: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price_per_unit: number;
    }>;
  }) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders
  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/orders?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data || []);
      } else {
        console.error('Failed to fetch orders:', result.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load orders when user changes
  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createOrder = async (orderData: {
    total_amount: number;
    shipping_address: string;
    phone: string;
    payment_method: string;
    notes?: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price_per_unit: number;
    }>;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          user_id: user.id,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchOrders(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
          status,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchOrders(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        createOrder,
        updateOrderStatus,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
