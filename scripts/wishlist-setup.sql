-- Wishlist Table Creation and Sample Data
-- This script creates the wishlist table and adds sample data

USE adminkit_pro_db;

-- Create wishlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS wishlist (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Ensure one wishlist item per user per product
    UNIQUE KEY unique_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

-- Insert sample wishlist data for existing users
INSERT IGNORE INTO wishlist (user_id, product_id) VALUES
-- Budi Santoso wishlist items
('customer-uuid-1', 'prod-uuid-3'), -- Mechanical Keyboard
('customer-uuid-1', 'prod-uuid-5'), -- Gaming Headset

-- Sarah Johnson wishlist items
('customer-uuid-2', 'prod-uuid-1'), -- Laptop Pro 14 inch
('customer-uuid-2', 'prod-uuid-4'), -- 4K Monitor 27"

-- Mike Chen wishlist items
('customer-uuid-3', 'prod-uuid-2'), -- Wireless Mouse Pro
('customer-uuid-3', 'prod-uuid-6'); -- Webcam HD

SELECT 'Wishlist table created and sample data inserted successfully!' as status;

-- Show wishlist data
SELECT
    u.name as user_name,
    p.name as product_name,
    p.price,
    w.created_at
FROM wishlist w
JOIN users u ON w.user_id = u.id
JOIN products p ON w.product_id = p.id
ORDER BY u.name, w.created_at DESC;

-- Count wishlist items per user
SELECT u.name, COUNT(w.id) as wishlist_count
FROM users u
LEFT JOIN wishlist w ON u.id = w.user_id
GROUP BY u.id, u.name
ORDER BY wishlist_count DESC;
