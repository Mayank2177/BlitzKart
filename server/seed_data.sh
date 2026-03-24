#!/bin/bash

echo "Seeding database with sample products..."

# Insert categories
sqlite3 database/ecommerce.db <<EOF
INSERT OR IGNORE INTO categories (id, name, slug, created_at, updated_at) VALUES
(1, 'Electronics', 'electronics', datetime('now'), datetime('now')),
(2, 'Clothing', 'clothing', datetime('now'), datetime('now')),
(3, 'Books', 'books', datetime('now'), datetime('now')),
(4, 'Home & Kitchen', 'home-kitchen', datetime('now'), datetime('now')),
(5, 'Sports', 'sports', datetime('now'), datetime('now'));

-- Insert products
INSERT OR IGNORE INTO products (id, name, description, sku, price, category_id, created_at, updated_at) VALUES
(1, 'Laptop Pro 15', 'High-performance laptop with 16GB RAM and 512GB SSD', 'LAPTOP-001', 1299.99, 1, datetime('now'), datetime('now')),
(2, 'Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 'MOUSE-001', 29.99, 1, datetime('now'), datetime('now')),
(3, 'Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 'KEYBOARD-001', 89.99, 1, datetime('now'), datetime('now')),
(4, 'USB-C Hub', '7-in-1 USB-C hub with HDMI and card reader', 'HUB-001', 49.99, 1, datetime('now'), datetime('now')),
(5, 'Noise Cancelling Headphones', 'Premium wireless headphones with active noise cancellation', 'HEADPHONE-001', 249.99, 1, datetime('now'), datetime('now')),
(6, 'Cotton T-Shirt', 'Comfortable 100% cotton t-shirt', 'TSHIRT-001', 19.99, 2, datetime('now'), datetime('now')),
(7, 'Denim Jeans', 'Classic fit denim jeans', 'JEANS-001', 59.99, 2, datetime('now'), datetime('now')),
(8, 'Running Shoes', 'Lightweight running shoes with cushioned sole', 'SHOES-001', 79.99, 5, datetime('now'), datetime('now')),
(9, 'Programming Book', 'Learn Go programming from scratch', 'BOOK-001', 39.99, 3, datetime('now'), datetime('now')),
(10, 'Coffee Maker', 'Automatic drip coffee maker with timer', 'COFFEE-001', 69.99, 4, datetime('now'), datetime('now')),
(11, 'Blender', 'High-speed blender for smoothies and shakes', 'BLENDER-001', 89.99, 4, datetime('now'), datetime('now')),
(12, 'Yoga Mat', 'Non-slip yoga mat with carrying strap', 'YOGA-001', 29.99, 5, datetime('now'), datetime('now')),
(13, 'Dumbbells Set', 'Adjustable dumbbells 5-25 lbs', 'DUMBBELL-001', 149.99, 5, datetime('now'), datetime('now')),
(14, 'Smartphone Stand', 'Adjustable phone stand for desk', 'STAND-001', 15.99, 1, datetime('now'), datetime('now')),
(15, 'Backpack', 'Water-resistant laptop backpack', 'BACKPACK-001', 49.99, 2, datetime('now'), datetime('now'));
EOF

echo "Database seeded successfully!"
echo "Checking product count..."
sqlite3 database/ecommerce.db "SELECT COUNT(*) as product_count FROM products;"
