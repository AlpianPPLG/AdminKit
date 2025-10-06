import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CUSTOMER']).optional().default('CUSTOMER'),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CUSTOMER']).optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  stock_quantity: z.number().int().min(0, 'Stock quantity must be non-negative'),
  image_url: z.string().url().optional().or(z.literal('')),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  stock_quantity: z.number().int().min(0, 'Stock quantity must be non-negative').optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

// Order validation schemas
export const createOrderSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  total_amount: z.number().min(0, 'Total amount must be non-negative'),
  shipping_address: z.string().min(1, 'Shipping address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  payment_method: z.string().min(1, 'Payment method is required'),
  notes: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    price_per_unit: z.number().min(0, 'Price per unit must be non-negative'),
  })).min(1, 'Order must have at least one item'),
});

export const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED']).optional(),
  shipping_address: z.string().optional(),
});

// Media validation schemas
export const uploadMediaSchema = z.object({
  file_name: z.string().min(1, 'File name is required'),
  file_url: z.string().url('Invalid file URL'),
  file_type: z.string().min(1, 'File type is required'),
  file_size_kb: z.number().int().min(0, 'File size must be non-negative'),
  uploaded_by_user_id: z.string().uuid('Invalid user ID'),
});

// Settings validation schemas
export const updateSettingSchema = z.object({
  setting_key: z.string().min(1, 'Setting key is required'),
  setting_value: z.string(),
  description: z.string().optional(),
});

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page must be at least 1'),
  limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Report validation schemas
export const reportSchema = z.object({
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  type: z.enum(['sales', 'users', 'products', 'orders']),
  format: z.enum(['csv', 'pdf']).optional(),
});

// Type exports for TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ReportInput = z.infer<typeof reportSchema>;

