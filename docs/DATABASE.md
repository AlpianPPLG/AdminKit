# AdminKit Pro - Database Documentation

This document provides detailed information about the database schema and structure used in the AdminKit Pro application.

## Database Overview

The application uses MySQL 8.0+ as its primary database. The schema consists of 7 main tables that support all the application's functionality:

1. `users` - User accounts and authentication
2. `products` - Product catalog
3. `orders` - Order management
4. `order_items` - Order line items
5. `media_library` - File management
6. `settings` - System configuration
7. `activity_logs` - Audit trail

## Database Schema

### Users Table

The users table stores all user account information including authentication details and roles.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN', 'CUSTOMER') DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Primary key, auto-incrementing integer
- `name` - User's full name (required)
- `email` - User's email address (required, unique)
- `password` - Hashed password (required)
- `role` - User role with values: SUPER_ADMIN, ADMIN, CUSTOMER (default: CUSTOMER)
- `created_at` - Timestamp when the record was created
- `updated_at` - Timestamp when the record was last updated

### Products Table

The products table stores all product information for the catalog.

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Primary key, auto-incrementing integer
- `name` - Product name (required)
- `description` - Product description (optional)
- `price` - Product price with 2 decimal places (required)
- `stock` - Available stock quantity (default: 0)
- `image_url` - URL to product image (optional)
- `created_at` - Timestamp when the record was created
- `updated_at` - Timestamp when the record was last updated

### Orders Table

The orders table stores all order information.

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Columns:**
- `id` - Primary key, auto-incrementing integer
- `user_id` - Foreign key referencing the users table
- `total_amount` - Total order amount with 2 decimal places (required)
- `status` - Order status with values: PENDING, PAID, SHIPPED, COMPLETED, CANCELLED (default: PENDING)
- `created_at` - Timestamp when the record was created
- `updated_at` - Timestamp when the record was last updated

### Order Items Table

The order_items table stores individual items within an order.

```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Columns:**
- `id` - Primary key, auto-incrementing integer
- `order_id` - Foreign key referencing the orders table
- `product_id` - Foreign key referencing the products table
- `quantity` - Quantity of the product in the order (required)
- `price` - Price of the product at the time of order (required)

### Media Library Table

The media_library table stores information about uploaded media files.

```sql
CREATE TABLE media_library (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  file_type VARCHAR(100),
  file_size INT,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

**Columns:**
- `id` - Primary key, auto-incrementing integer
- `filename` - Original filename (required)
- `url` - URL to access the file (required)
- `file_type` - MIME type of the file (optional)
- `file_size` - Size of the file in bytes (optional)
- `uploaded_by` - Foreign key referencing the users table (user who uploaded the file)
- `created_at` - Timestamp when the record was created

### Settings Table

The settings table stores application configuration settings.

```sql
CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description VARCHAR(255)
);
```

**Columns:**
- `id` - Primary key, auto-incrementing integer
- `key_name` - Unique key identifier for the setting (required)
- `value` - Setting value (optional)
- `description` - Description of the setting (optional)

### Activity Logs Table

The activity_logs table stores audit trail information for user activities.

```sql
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Columns:**
- `id` - Primary key, auto-incrementing integer
- `user_id` - Foreign key referencing the users table
- `action` - Action performed (required)
- `description` - Detailed description of the action (optional)
- `ip_address` - IP address of the user (optional)
- `user_agent` - Browser user agent string (optional)
- `created_at` - Timestamp when the record was created

## Sample Data

The application includes sample data for demonstration purposes. The database setup script (`database-setup.sql`) includes:

### Sample Users
- Super Admin: admin@example.com (password: password123)
- Admin: admin@demo.com (password: password123)
- Customers: budi@example.com, sarah@demo.com, mike@demo.com (password: password123)

### Sample Products
- Laptop Pro 14 inch - Rp 15,000,000
- Wireless Mouse Pro - Rp 350,000
- Mechanical Keyboard - Rp 1,200,000
- 4K Monitor 27" - Rp 4,500,000
- Gaming Headset - Rp 800,000
- Webcam HD - Rp 600,000

### Sample Orders
- Order 1: PAID - Rp 15,700,000 (Laptop + 2 Mouse)
- Order 2: SHIPPED - Rp 5,700,000 (Monitor + Mouse + Keyboard)
- Order 3: PENDING - Rp 2,000,000 (Keyboard + 2 Mouse)
- Order 4: COMPLETED - Rp 800,000 (Gaming Headset)
- Order 5: CANCELLED - Rp 1,200,000 (2 Webcam)

### Sample Media Files
- Product Banner (JPG)
- Company Logo (PNG)
- User Manual (PDF)
- Product Catalog (PDF)
- Demo Video (MP4)
- Presentation (PPTX)

## Database Connection

The application connects to the database using the configuration in `src/lib/database.ts`. The connection parameters are set through environment variables:

- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

## Security Considerations

### Password Security
Passwords are hashed using bcrypt before being stored in the database.

### SQL Injection Prevention
The application uses parameterized queries to prevent SQL injection attacks.

### Data Validation
All data is validated both on the client-side and server-side before being stored in the database.

## Backup and Maintenance

Regular database backups are recommended. The application includes a backup functionality in the settings module (planned for implementation).

## Indexes

The following indexes are recommended for optimal performance:

1. `users` table:
   - Primary key on `id`
   - Unique index on `email`

2. `products` table:
   - Primary key on `id`
   - Index on `name` for search functionality

3. `orders` table:
   - Primary key on `id`
   - Index on `user_id`
   - Index on `status`

4. `order_items` table:
   - Primary key on `id`
   - Index on `order_id`
   - Index on `product_id`

5. `media_library` table:
   - Primary key on `id`
   - Index on `uploaded_by`

6. `activity_logs` table:
   - Primary key on `id`
   - Index on `user_id`
   - Index on `action`
   - Index on `created_at`