-- AdminKit Pro Database Setup
-- Run this script to set up the database for AdminKit Pro

CREATE DATABASE IF NOT EXISTS adminkit_pro_db;
USE adminkit_pro_db;

-- Tabel Pengguna (Users)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    avatar_url VARCHAR(500),
    role ENUM('SUPER_ADMIN', 'ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Produk (Products)
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Pesanan (Orders)
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    shipping_address TEXT,
    phone VARCHAR(20),
    payment_method VARCHAR(50), 
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Item Pesanan (Order Items) - Menghubungkan Orders dan Products
CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Tabel Payment Methods
CREATE TABLE payment_methods (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('CREDIT_CARD', 'DEBIT_CARD', 'E_WALLET', 'BANK_TRANSFER') NOT NULL,
    provider VARCHAR(50) NOT NULL, -- Visa, Mastercard, GoPay, OVO, etc.
    card_number VARCHAR(20), -- Masked card number like ****4242
    expiry_month INT,
    expiry_year INT,
    holder_name VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Pustaka Media (Media Library)
CREATE TABLE media_library (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50), -- misal: 'image/jpeg', 'application/pdf'
    file_size_kb INT,
    uploaded_by_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
);

-- Tabel Pengaturan Sistem (Settings) - dengan pola Key-Value
CREATE TABLE settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    description VARCHAR(255)
);

-- Tabel Log Aktivitas (Audit Trail)
CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Contoh Sample Data untuk memulai
-- Password untuk semua user adalah "password123"
INSERT INTO users (id, name, email, password, role) VALUES
('superadmin-uuid', 'Admin Utama', 'admin@example.com', '$2a$10$3P8Fz6T9cR1wY.E3f.D2n.pL5jA1rF.l7iZ.hJ6s.K8y.U9wI3uC.', 'SUPER_ADMIN'),
('admin-uuid-1', 'John Admin', 'admin@demo.com', '$2a$10$3P8Fz6T9cR1wY.E3f.D2n.pL5jA1rF.l7iZ.hJ6s.K8y.U9wI3uC.', 'ADMIN'),
('customer-uuid-1', 'Budi Santoso', 'budi@example.com', '$2a$10$3P8Fz6T9cR1wY.E3f.D2n.pL5jA1rF.l7iZ.hJ6s.K8y.U9wI3uC.', 'CUSTOMER'),
('customer-uuid-2', 'Sarah Johnson', 'sarah@demo.com', '$2a$10$3P8Fz6T9cR1wY.E3f.D2n.pL5jA1rF.l7iZ.hJ6s.K8y.U9wI3uC.', 'CUSTOMER'),
('customer-uuid-3', 'Mike Chen', 'mike@demo.com', '$2a$10$3P8Fz6T9cR1wY.E3f.D2n.pL5jA1rF.l7iZ.hJ6s.K8y.U9wI3uC.', 'CUSTOMER');

INSERT INTO products (id, name, description, price, stock_quantity, image_url) VALUES
('prod-uuid-1', 'Laptop Pro 14 inch', 'High-performance laptop with 16GB RAM and 512GB SSD', 15000000.00, 50, 'https://via.placeholder.com/300x200?text=Laptop+Pro'),
('prod-uuid-2', 'Wireless Mouse Pro', 'Ergonomic wireless mouse with precision tracking', 350000.00, 200, 'https://via.placeholder.com/300x200?text=Mouse+Pro'),
('prod-uuid-3', 'Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 1200000.00, 75, 'https://via.placeholder.com/300x200?text=Keyboard'),
('prod-uuid-4', '4K Monitor 27"', 'Ultra HD monitor with 99% sRGB color accuracy', 4500000.00, 30, 'https://via.placeholder.com/300x200?text=4K+Monitor'),
('prod-uuid-5', 'Gaming Headset', '7.1 surround sound gaming headset with microphone', 800000.00, 100, 'https://via.placeholder.com/300x200?text=Gaming+Headset'),
('prod-uuid-6', 'Webcam HD', '1080p webcam with auto-focus and noise reduction', 600000.00, 60, 'https://via.placeholder.com/300x200?text=Webcam+HD');

-- Sample orders
INSERT INTO orders (id, user_id, total_amount, status, shipping_address) VALUES
('order-uuid-1', 'customer-uuid-1', 15700000.00, 'PAID', 'Jl. Sudirman No. 123, Jakarta Pusat'),
('order-uuid-2', 'customer-uuid-2', 5700000.00, 'SHIPPED', 'Jl. Thamrin No. 456, Jakarta Selatan'),
('order-uuid-3', 'customer-uuid-3', 2000000.00, 'PENDING', 'Jl. Gatot Subroto No. 789, Jakarta Barat'),
('order-uuid-4', 'customer-uuid-1', 800000.00, 'COMPLETED', 'Jl. Sudirman No. 123, Jakarta Pusat'),
('order-uuid-5', 'customer-uuid-2', 1200000.00, 'CANCELLED', 'Jl. Thamrin No. 456, Jakarta Selatan');

INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) VALUES
('order-uuid-1', 'prod-uuid-1', 1, 15000000.00),
('order-uuid-1', 'prod-uuid-2', 2, 350000.00),
('order-uuid-2', 'prod-uuid-4', 1, 4500000.00),
('order-uuid-2', 'prod-uuid-2', 1, 350000.00),
('order-uuid-2', 'prod-uuid-3', 1, 1200000.00),
('order-uuid-3', 'prod-uuid-3', 1, 1200000.00),
('order-uuid-3', 'prod-uuid-2', 2, 350000.00),
('order-uuid-4', 'prod-uuid-5', 1, 800000.00),
('order-uuid-5', 'prod-uuid-6', 2, 600000.00);

INSERT INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'AdminKit Pro', 'Nama situs yang ditampilkan di header'),
('maintenance_mode', 'false', 'Aktifkan mode maintenance untuk semua pengunjung'),
('default_currency', 'IDR', 'Mata uang default untuk harga produk'),
('default_theme', 'system', 'Tema default aplikasi'),
('logo_url', '', 'URL logo aplikasi'),
('favicon_url', '', 'URL favicon aplikasi'),
('session_timeout', '30', 'Timeout sesi dalam menit'),
('max_login_attempts', '5', 'Maksimal percobaan login'),
('require_2fa', 'false', 'Wajibkan two-factor authentication'),
('password_policy', 'true', 'Terapkan kebijakan password'),
('api_rate_limit', '100', 'Rate limit API per menit'),
('cache_ttl', '3600', 'TTL cache dalam detik'),
('backup_frequency', 'daily', 'Frekuensi backup'),
('debug_mode', 'false', 'Mode debug'),
('analytics_enabled', 'true', 'Aktifkan analytics');

-- Insert sample payment methods
INSERT INTO payment_methods (id, user_id, type, provider, card_number, expiry_month, expiry_year, holder_name, is_default) VALUES
('payment-uuid-1', 'customer-uuid-1', 'CREDIT_CARD', 'Mastercard', '****789', 12, 2025, 'Budi Santoso', TRUE),
('payment-uuid-2', 'customer-uuid-1', 'CREDIT_CARD', 'Visa', '****1234', 8, 2026, 'Budi Santoso', FALSE),
('payment-uuid-3', 'customer-uuid-2', 'CREDIT_CARD', 'Visa', '****5678', 6, 2025, 'Sarah Johnson', TRUE),
('payment-uuid-4', 'customer-uuid-2', 'E_WALLET', 'GoPay', NULL, NULL, NULL, 'Sarah Johnson', FALSE),
('payment-uuid-5', 'customer-uuid-3', 'DEBIT_CARD', 'BCA', '****9012', 3, 2027, 'Mike Chen', TRUE);

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action, details) VALUES
('superadmin-uuid', 'LOGIN', 'Admin logged in successfully'),
('superadmin-uuid', 'CREATE_PRODUCT', 'Created product: Laptop Pro 14 inch'),
('customer-uuid-1', 'CREATE_ORDER', 'Created order: order-uuid-1'),
('superadmin-uuid', 'UPDATE_ORDER', 'Updated order status to PAID'),
('admin-uuid-1', 'LOGIN', 'Admin logged in successfully'),
('customer-uuid-2', 'CREATE_ORDER', 'Created order: order-uuid-2'),
('customer-uuid-3', 'CREATE_ORDER', 'Created order: order-uuid-3'),
('superadmin-uuid', 'CREATE_PRODUCT', 'Created product: Mechanical Keyboard'),
('admin-uuid-1', 'UPDATE_PRODUCT', 'Updated product: Wireless Mouse Pro'),
('customer-uuid-1', 'CREATE_ORDER', 'Created order: order-uuid-4'),
('customer-uuid-2', 'CANCEL_ORDER', 'Cancelled order: order-uuid-5');

-- Insert sample media files
INSERT INTO media_library (file_name, file_url, file_type, file_size_kb, uploaded_by_user_id) VALUES
('product-banner.jpg', 'https://via.placeholder.com/800x400?text=Product+Banner', 'image/jpeg', 245, 'superadmin-uuid'),
('company-logo.png', 'https://via.placeholder.com/200x100?text=Logo', 'image/png', 45, 'superadmin-uuid'),
('user-manual.pdf', 'https://via.placeholder.com/300x400?text=User+Manual', 'application/pdf', 1200, 'admin-uuid-1'),
('product-catalog.pdf', 'https://via.placeholder.com/300x400?text=Product+Catalog', 'application/pdf', 850, 'admin-uuid-1'),
('demo-video.mp4', 'https://via.placeholder.com/400x300?text=Demo+Video', 'video/mp4', 2500, 'superadmin-uuid'),
('presentation.pptx', 'https://via.placeholder.com/300x400?text=Presentation', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 3200, 'admin-uuid-1');

-- Show tables
SHOW TABLES;

-- Show sample data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'Orders' as table_name, COUNT(*) as count FROM orders
UNION ALL
SELECT 'Order Items' as table_name, COUNT(*) as count FROM order_items
UNION ALL
SELECT 'Payment Methods' as table_name, COUNT(*) as count FROM payment_methods
UNION ALL
SELECT 'Media Files' as table_name, COUNT(*) as count FROM media_library
UNION ALL
SELECT 'Settings' as table_name, COUNT(*) as count FROM settings
UNION ALL
SELECT 'Activity Logs' as table_name, COUNT(*) as count FROM activity_logs;
