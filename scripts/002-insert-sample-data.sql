-- Insert sample data for Ahmed General Store

-- Insert default admin
INSERT INTO admins (username, email, password_hash, name, role) VALUES 
('admin', 'admin@ahmedstore.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9Qu', 'Ahmed Khan', 'super_admin'),
('manager', 'manager@ahmedstore.com', '$2b$10$rQZ9QmjlhQZ9QmjlhQZ9Qu', 'Ali Ahmed', 'manager');

-- Insert categories
INSERT INTO categories (name, description, image_url, sort_order) VALUES 
('Grocery', 'Daily grocery items and essentials', '/placeholder.svg?height=200&width=200&text=Grocery', 1),
('Dairy', 'Fresh dairy products', '/placeholder.svg?height=200&width=200&text=Dairy', 2),
('Beverages', 'Drinks and beverages', '/placeholder.svg?height=200&width=200&text=Beverages', 3),
('Snacks', 'Snacks and confectionery', '/placeholder.svg?height=200&width=200&text=Snacks', 4),
('Bakery', 'Fresh bakery items', '/placeholder.svg?height=200&width=200&text=Bakery', 5),
('Personal Care', 'Personal hygiene and care products', '/placeholder.svg?height=200&width=200&text=Personal+Care', 6),
('Household', 'Household cleaning and utilities', '/placeholder.svg?height=200&width=200&text=Household', 7);

-- Insert sample products
INSERT INTO products (name, description, category_id, unit, price, cost_price, stock_quantity, low_stock_alert, image_url, sku, is_featured) VALUES 
('Basmati Rice Premium', 'Premium quality basmati rice from Punjab', (SELECT id FROM categories WHERE name = 'Grocery'), '5kg', 850.00, 750.00, 45, 10, '/placeholder.svg?height=200&width=200&text=Basmati+Rice', 'GR001', true),
('Fresh Milk', 'Fresh cow milk from local farms', (SELECT id FROM categories WHERE name = 'Dairy'), '1L', 120.00, 100.00, 25, 15, '/placeholder.svg?height=200&width=200&text=Fresh+Milk', 'DA001', true),
('Cooking Oil Sunflower', 'Pure sunflower cooking oil', (SELECT id FROM categories WHERE name = 'Grocery'), '1L', 280.00, 250.00, 30, 10, '/placeholder.svg?height=200&width=200&text=Cooking+Oil', 'GR002', false),
('Coca Cola', 'Refreshing cola drink', (SELECT id FROM categories WHERE name = 'Beverages'), '1.5L', 150.00, 120.00, 50, 20, '/placeholder.svg?height=200&width=200&text=Coca+Cola', 'BV001', true),
('Lays Chips Original', 'Crispy potato chips original flavor', (SELECT id FROM categories WHERE name = 'Snacks'), '50g', 50.00, 40.00, 80, 25, '/placeholder.svg?height=200&width=200&text=Lays+Chips', 'SN001', false),
('White Bread', 'Fresh white bread daily baked', (SELECT id FROM categories WHERE name = 'Bakery'), '1 loaf', 80.00, 60.00, 15, 10, '/placeholder.svg?height=200&width=200&text=White+Bread', 'BK001', false),
('Sugar White', 'Pure white sugar', (SELECT id FROM categories WHERE name = 'Grocery'), '1kg', 110.00, 95.00, 40, 15, '/placeholder.svg?height=200&width=200&text=Sugar', 'GR003', false),
('Tea Bags Premium', 'Premium quality tea bags', (SELECT id FROM categories WHERE name = 'Beverages'), '100pcs', 450.00, 380.00, 25, 10, '/placeholder.svg?height=200&width=200&text=Tea+Bags', 'BV002', true),
('Yogurt Plain', 'Fresh plain yogurt', (SELECT id FROM categories WHERE name = 'Dairy'), '500g', 90.00, 70.00, 20, 12, '/placeholder.svg?height=200&width=200&text=Yogurt', 'DA002', false),
('Biscuits Chocolate', 'Chocolate cream biscuits', (SELECT id FROM categories WHERE name = 'Snacks'), '200g', 120.00, 95.00, 35, 15, '/placeholder.svg?height=200&width=200&text=Biscuits', 'SN002', false);

-- Insert sample users
INSERT INTO users (name, email, phone, address, city) VALUES 
('Ali Ahmed', 'ali@example.com', '03001234567', 'House 123, Block A, Gulshan Town', 'Karachi'),
('Fatima Khan', 'fatima@example.com', '03009876543', 'Flat 45, DHA Phase 2', 'Lahore'),
('Hassan Ali', 'hassan@example.com', '03005555555', 'Street 15, F-8/2', 'Islamabad'),
('Sara Khan', 'sara@example.com', '03001111111', 'House 67, Model Town', 'Faisalabad'),
('Ahmed Raza', 'ahmed@example.com', '03002222222', 'Block C, Johar Town', 'Lahore');

-- Insert sample orders
INSERT INTO orders (order_number, user_id, customer_name, customer_phone, customer_email, delivery_address, city, total_amount, final_amount, status) VALUES 
('ORD-001', (SELECT id FROM users WHERE phone = '03001234567'), 'Ali Ahmed', '03001234567', 'ali@example.com', 'House 123, Block A, Gulshan Town', 'Karachi', 1250.00, 1250.00, 'pending'),
('ORD-002', (SELECT id FROM users WHERE phone = '03009876543'), 'Fatima Khan', '03009876543', 'fatima@example.com', 'Flat 45, DHA Phase 2', 'Lahore', 1700.00, 1700.00, 'confirmed'),
('ORD-003', (SELECT id FROM users WHERE phone = '03005555555'), 'Hassan Ali', '03005555555', 'hassan@example.com', 'Street 15, F-8/2', 'Islamabad', 450.00, 450.00, 'delivered'),
('ORD-004', (SELECT id FROM users WHERE phone = '03001111111'), 'Sara Khan', '03001111111', 'sara@example.com', 'House 67, Model Town', 'Faisalabad', 680.00, 680.00, 'delivered');

-- Insert order items
INSERT INTO order_items (order_id, product_id, product_name, product_unit, quantity, unit_price, total_price) VALUES 
((SELECT id FROM orders WHERE order_number = 'ORD-001'), (SELECT id FROM products WHERE sku = 'GR001'), 'Basmati Rice Premium', '5kg', 1, 850.00, 850.00),
((SELECT id FROM orders WHERE order_number = 'ORD-001'), (SELECT id FROM products WHERE sku = 'GR002'), 'Cooking Oil Sunflower', '1L', 1, 280.00, 280.00),
((SELECT id FROM orders WHERE order_number = 'ORD-001'), (SELECT id FROM products WHERE sku = 'DA001'), 'Fresh Milk', '1L', 1, 120.00, 120.00),
((SELECT id FROM orders WHERE order_number = 'ORD-002'), (SELECT id FROM products WHERE sku = 'GR001'), 'Basmati Rice Premium', '5kg', 2, 850.00, 1700.00),
((SELECT id FROM orders WHERE order_number = 'ORD-003'), (SELECT id FROM products WHERE sku = 'BV002'), 'Tea Bags Premium', '100pcs', 1, 450.00, 450.00),
((SELECT id FROM orders WHERE order_number = 'ORD-004'), (SELECT id FROM products WHERE sku = 'GR003'), 'Sugar White', '1kg', 2, 110.00, 220.00),
((SELECT id FROM orders WHERE order_number = 'ORD-004'), (SELECT id FROM products WHERE sku = 'GR002'), 'Cooking Oil Sunflower', '1L', 1, 280.00, 280.00),
((SELECT id FROM orders WHERE order_number = 'ORD-004'), (SELECT id FROM products WHERE sku = 'BK001'), 'White Bread', '1 loaf', 2, 80.00, 160.00);

-- Insert sample offers
INSERT INTO offers (title, description, type, value, min_order_amount, code, usage_limit, is_active, start_date, end_date, created_by) VALUES 
('New Year Special', '10% off on orders above Rs. 1000', 'percentage', 10.00, 1000.00, 'NEWYEAR10', 100, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', (SELECT id FROM admins WHERE username = 'admin')),
('Free Delivery', 'Free delivery on orders above Rs. 500', 'fixed_amount', 50.00, 500.00, 'FREEDEL', 200, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15 days', (SELECT id FROM admins WHERE username = 'admin'));

-- Insert sample notifications
INSERT INTO notifications (type, title, message, data, recipient_type, priority) VALUES 
('order', 'New Order Received', 'Order ORD-001 has been placed by Ali Ahmed', '{"order_id": "ORD-001", "customer": "Ali Ahmed", "amount": 1250}', 'admin', 'high'),
('low_stock', 'Low Stock Alert', 'White Bread is running low on stock (15 units remaining)', '{"product_id": "BK001", "current_stock": 15, "alert_level": 10}', 'admin', 'normal'),
('system', 'Daily Backup Complete', 'Daily database backup completed successfully', '{"backup_time": "2024-01-20 02:00:00", "size": "45MB"}', 'admin', 'low');

-- Insert sample conversations and messages
INSERT INTO conversations (customer_id, customer_name, customer_phone, last_message, unread_count) VALUES 
((SELECT id FROM users WHERE phone = '03001234567'), 'Ali Ahmed', '03001234567', 'When will my order be delivered?', 1),
((SELECT id FROM users WHERE phone = '03009876543'), 'Fatima Khan', '03009876543', 'Thank you for the quick delivery!', 0);

INSERT INTO messages (conversation_id, sender_type, sender_id, sender_name, message) VALUES 
((SELECT id FROM conversations WHERE customer_phone = '03001234567'), 'customer', (SELECT id FROM users WHERE phone = '03001234567'), 'Ali Ahmed', 'Hello, I placed an order today. When will it be delivered?'),
((SELECT id FROM conversations WHERE customer_phone = '03001234567'), 'admin', (SELECT id FROM admins WHERE username = 'admin'), 'Ahmed Khan', 'Hello Ali! Your order will be delivered within 2-3 hours. Thank you for shopping with us!'),
((SELECT id FROM conversations WHERE customer_phone = '03001234567'), 'customer', (SELECT id FROM users WHERE phone = '03001234567'), 'Ali Ahmed', 'When will my order be delivered?'),
((SELECT id FROM conversations WHERE customer_phone = '03009876543'), 'customer', (SELECT id FROM users WHERE phone = '03009876543'), 'Fatima Khan', 'Thank you for the quick delivery!'),
((SELECT id FROM conversations WHERE customer_phone = '03009876543'), 'admin', (SELECT id FROM admins WHERE username = 'admin'), 'Ahmed Khan', 'You are most welcome! We appreciate your business.');

-- Insert sample sales analytics
INSERT INTO sales_analytics (date, total_orders, total_sales, total_customers, avg_order_value) VALUES 
(CURRENT_DATE - INTERVAL '6 days', 12, 15000.00, 8, 1250.00),
(CURRENT_DATE - INTERVAL '5 days', 18, 22500.00, 12, 1250.00),
(CURRENT_DATE - INTERVAL '4 days', 15, 18750.00, 10, 1250.00),
(CURRENT_DATE - INTERVAL '3 days', 22, 27500.00, 15, 1250.00),
(CURRENT_DATE - INTERVAL '2 days', 19, 23750.00, 13, 1250.00),
(CURRENT_DATE - INTERVAL '1 days', 25, 31250.00, 18, 1250.00),
(CURRENT_DATE, 4, 4080.00, 4, 1020.00);
