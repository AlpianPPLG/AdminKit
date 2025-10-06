/* eslint-disable @typescript-eslint/no-explicit-any */
// User types
export interface User {
  token: string;
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar_url?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  avatar_url?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER';
  avatar_url?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  image_url?: string;
}

// Order types
export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  shipping_address?: string;
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
  product?: Product;
}

export interface CreateOrderData {
  user_id: string;
  total_amount: number;
  shipping_address?: string;
  items: {
    product_id: string;
    quantity: number;
    price_per_unit: number;
  }[];
}

export interface UpdateOrderData {
  status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  shipping_address?: string;
}

// Media Library types
export interface MediaFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_kb: number;
  uploaded_by_user_id: string;
  created_at: string;
  uploaded_by?: User;
}

export interface UploadMediaData {
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_kb: number;
  uploaded_by_user_id: string;
}

// Settings types
export interface Setting {
  setting_key: string;
  setting_value: string;
  description?: string;
}

// Activity Log types
export interface ActivityLog {
  id: number;
  user_id: string;
  action: string;
  details?: string;
  created_at: string;
  user?: User;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  recentUsers: User[];
  recentActivity: ActivityLog[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  children?: NavItem[];
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  date?: string;
}

