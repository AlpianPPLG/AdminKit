# AdminKit Pro - Modules Documentation

This document provides detailed information about each module in the AdminKit Pro application, including their features, components, and functionality.

## Dashboard Module

The dashboard module serves as the main entry point after login, providing an overview of key metrics and recent activities.

### Features
- Real-time KPI cards displaying total users, products, orders, and revenue
- Interactive analytics charts showing sales trends
- Recent activity feed showing user actions
- Quick action buttons for common tasks

### Components
- `src/app/dashboard/page.tsx` - Main dashboard page
- `src/components/dashboard/kpi-card.tsx` - Key performance indicator cards
- `src/components/dashboard/analytics-chart.tsx` - Data visualization charts
- `src/components/dashboard/recent-activity.tsx` - Activity feed component

### API Endpoints
- `GET /api/dashboard/stats` - Retrieve dashboard statistics

## User Management Module

The user management module provides complete CRUD operations for managing user accounts with role-based access control.

### Features
- User listing with search and filtering capabilities
- User creation with role assignment
- User profile editing
- User deletion
- Role-based access control (SUPER_ADMIN, ADMIN, CUSTOMER)

### Components
- `src/app/dashboard/users/page.tsx` - User listing page
- `src/app/dashboard/users/[id]/page.tsx` - User detail/edit page
- User table with sorting and pagination
- User creation/editing forms with validation

### API Endpoints
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Product Management Module

The product management module handles the product catalog with inventory tracking.

### Features
- Product listing with search and filtering
- Product creation with image URL
- Product editing
- Product deletion
- Inventory tracking with stock levels

### Components
- `src/app/dashboard/products/page.tsx` - Product listing page
- `src/app/dashboard/products/[id]/page.tsx` - Product detail/edit page
- Product table with sorting and pagination
- Product creation/editing forms with validation

### API Endpoints
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

## Order Management Module

The order management module handles order processing and status tracking.

### Features
- Order listing with status filtering
- Order details view with line items
- Order status updates
- Customer information display
- Order total calculation

### Components
- `src/app/dashboard/orders/page.tsx` - Order listing page
- `src/app/dashboard/orders/[id]/page.tsx` - Order detail page
- Order table with sorting and filtering
- Order status update forms

### API Endpoints
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}` - Update order status

## Media Library Module

The media library module provides file upload and management capabilities.

### Features
- File listing with previews
- File upload functionality
- File deletion
- URL copying for easy sharing
- File type filtering

### Components
- `src/app/dashboard/media/page.tsx` - Media library page
- `src/app/dashboard/media/[id]/page.tsx` - Media detail page
- File upload component
- Media grid/table view

### API Endpoints
- `GET /api/media` - Get all media files
- `POST /api/media` - Upload file
- `GET /api/media/{id}` - Get file by ID
- `DELETE /api/media/{id}` - Delete file

## Reports & Analytics Module

The reports module provides comprehensive reporting with data visualization.

### Features
- Sales reports with charts
- User analytics
- Product performance metrics
- Date range filtering
- Data export functionality (planned)

### Components
- `src/app/dashboard/reports/page.tsx` - Reports page
- Analytics charts using Recharts
- Data tables with export options
- Date range selector

### API Endpoints
- `GET /api/reports` - Get report data (planned)
- `GET /api/reports/export` - Export report data (planned)

## Settings Module

The settings module handles system configuration and preferences.

### Features
- Application settings management
- System information display
- Theme settings
- Backup functionality (planned)

### Components
- `src/app/dashboard/settings/page.tsx` - Settings page
- Settings form with validation
- System information cards
- Theme switcher

### API Endpoints
- `GET /api/settings` - Get all settings
- `PUT /api/settings` - Update setting
- `GET /api/system/info` - Get system information (planned)
- `POST /api/system/backup` - Create backup (planned)

## Authentication Module

The authentication module handles user login, registration, and session management.

### Features
- User login with email and password
- User registration
- JWT token-based authentication
- Role-based access control
- Protected route enforcement

### Components
- `src/app/login/page.tsx` - Login page
- `src/app/register/page.tsx` - Registration page
- `src/components/auth/protected-route.tsx` - Route protection component
- `src/components/auth/access-denied.tsx` - Access denied page
- `src/lib/auth-context.tsx` - Authentication context
- `src/lib/auth.ts` - Authentication utilities

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Landing Page Module

The landing page module provides information about the application for visitors.

### Features
- Comprehensive information about the application
- Feature showcase with interactive cards
- Statistics display
- Call-to-action for registration
- Responsive design

### Components
- `src/app/landing/page.tsx` - Landing page
- Feature cards
- Statistics display
- Call-to-action buttons

## Catalog Module

The catalog module provides a user-facing product catalog.

### Features
- Product listing with search
- Product detail views
- Responsive grid layout
- Product information display

### Components
- `src/app/catalog/page.tsx` - Product catalog page
- Product grid/cards
- Search functionality
- Product detail modal/view

## Cart Module

The cart module handles user shopping cart functionality.

### Features
- Add/remove products from cart
- Update quantities
- Calculate totals
- Persistent cart storage

### Components
- `src/app/cart/page.tsx` - Shopping cart page
- `src/lib/cart-context.tsx` - Cart context management
- Cart item components
- Cart summary

### API Integration
- Uses context API for state management
- Integrates with product data

## Wishlist Module

The wishlist module allows users to save products for later.

### Features
- Add/remove products from wishlist
- Persistent wishlist storage
- Wishlist management

### Components
- `src/app/wishlist/page.tsx` - Wishlist page
- `src/lib/wishlist-context.tsx` - Wishlist context management
- Wishlist item components

### API Integration
- Uses context API for state management
- Integrates with product data

## Checkout Module

The checkout module handles the order processing flow.

### Features
- Order summary
- Customer information collection
- Payment method selection
- Order confirmation

### Components
- `src/app/checkout/page.tsx` - Checkout page
- Order summary component
- Customer information form
- Payment method selection

### API Integration
- Creates orders in the database
- Integrates with user and product data

## Profile Module

The user profile module allows users to manage their account information.

### Features
- View profile information
- Update profile details
- Change password (planned)
- Order history view

### Components
- `src/app/dashboard/profile/page.tsx` - User profile page
- Profile information display
- Profile editing form

### API Integration
- Updates user information
- Retrieves user order history

## Payment Methods Module

The payment methods module manages user payment information.

### Features
- View saved payment methods
- Add new payment methods
- Delete payment methods
- Set default payment method

### Components
- `src/app/dashboard/payment-methods/page.tsx` - Payment methods page
- `src/components/payment-method-form.tsx` - Payment method form
- `src/lib/payment-methods-context.tsx` - Payment methods context

### API Integration
- Manages payment method data
- Integrates with user data

## My Orders Module

The my orders module allows users to view their order history.

### Features
- View personal order history
- Order details
- Order status tracking
- Reorder functionality (planned)

### Components
- `src/app/dashboard/my-orders/page.tsx` - My orders page
- Order list component
- Order detail view

### API Integration
- Retrieves orders for the current user
- Integrates with order data

## Demo Module

The demo module provides demonstration functionality.

### Features
- Sample pages for demonstration
- Example components
- Demo data

### Components
- `src/app/demo/page.tsx` - Demo page
- Various example components

## Module Relationships

### User-Related Modules
- Authentication → User Management
- Profile → User Management
- My Orders → Orders
- Wishlist → Products
- Cart → Products
- Checkout → Orders, Products, Users

### Admin-Only Modules
- Dashboard (admin)
- User Management
- Product Management
- Order Management
- Media Library
- Reports
- Settings

### Shared Modules
- Landing Page (public)
- Catalog (public)
- Authentication (public)

## Access Control

### SUPER_ADMIN Role
- Full access to all modules
- Can manage other administrators
- System-level configuration

### ADMIN Role
- Access to all admin modules except user role management
- Cannot delete SUPER_ADMIN users
- Limited system configuration access

### CUSTOMER Role
- Access to public modules
- Access to personal profile
- Access to personal orders
- Access to wishlist and cart
- Limited dashboard view

## Future Module Enhancements

### Planned Modules
1. **Categories Module** - Product categorization
2. **Reviews Module** - Product reviews and ratings
3. **Notifications Module** - Real-time notifications
4. **Activity Logs Module** - Detailed audit trail viewer
5. **Bulk Operations Module** - Bulk import/export functionality

### Module Improvements
1. **Advanced Search** - Implement full-text search across all modules
2. **Real-time Updates** - Add WebSocket support for real-time data updates
3. **Mobile Optimization** - Enhanced mobile experience for all modules
4. **API Documentation** - Interactive API documentation module
5. **Audit Trail** - Comprehensive logging for all user actions