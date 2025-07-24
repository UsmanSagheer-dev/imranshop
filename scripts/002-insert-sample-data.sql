-- Sample data for Ahmed General Store

-- Insert admin user
INSERT INTO admins (username, email, password_hash, name, role) VALUES 
('admin', 'admin@ahmedstore.com', '$2b$10$rQZ8kHWfQxwjQxwjQxwjQe', 'Ahmed Store Admin', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, description, sort_order) VALUES 
('Groceries', 'Daily grocery items and food products', 1),
('Dairy Products', 'Milk, cheese, yogurt and dairy items', 2),
('Fruits & Vegetables', 'Fresh fruits and vegetables', 3),
('Meat & Poultry', 'Fresh meat and poultry products', 4),
('Beverages', 'Soft drinks, juices and beverages', 5),
('Snacks', 'Chips, biscuits and snack items', 6),
('Personal Care', 'Soaps, shampoos and personal care items', 7),
('Household Items', 'Cleaning supplies and household products', 8)
ON CONFLICT (name) DO NOTHING;

-- Get category IDs for products
DO $$
DECLARE
    grocery_id UUID;
    dairy_id UUID;
    fruits_id UUID;
    meat_id UUID;
    beverages_id UUID;
    snacks_id UUID;
    personal_id UUID;
    household_id UUID;
    admin_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO grocery_id FROM categories WHERE name = 'Groceries';
    SELECT id INTO dairy_id FROM categories WHERE name = 'Dairy Products';
    SELECT id INTO fruits_id FROM categories WHERE name = 'Fruits & Vegetables';
    SELECT id INTO meat_id FROM categories WHERE name = 'Meat & Poultry';
    SELECT id INTO beverages_id FROM categories WHERE name = 'Beverages';
    SELECT id INTO snacks_id FROM categories WHERE name = 'Snacks';
    SELECT id INTO personal_id FROM categories WHERE name = 'Personal Care';
    SELECT id INTO household_id FROM categories WHERE name = 'Household Items';
    SELECT id INTO admin_id FROM admins WHERE username = 'admin';

    -- Insert sample products
    INSERT INTO products (name, description, category_id, unit, price, cost_price, stock_quantity, low_stock_alert, is_featured, created_by) VALUES 
    -- Groceries
    ('Basmati Rice', 'Premium quality basmati rice', grocery_id, 'kg', 180.00, 150.00, 100, 10, true, admin_id),
    ('Wheat Flour', 'Fine quality wheat flour', grocery_id, 'kg', 85.00, 70.00, 150, 20, false, admin_id),
    ('Sugar', 'White refined sugar', grocery_id, 'kg', 120.00, 100.00, 80, 15, false, admin_id),
    ('Cooking Oil', 'Sunflower cooking oil', grocery_id, 'liter', 350.00, 300.00, 50, 10, true, admin_id),
    
    -- Dairy Products
    ('Fresh Milk', 'Pure cow milk', dairy_id, 'liter', 140.00, 120.00, 30, 5, true, admin_id),
    ('Yogurt', 'Fresh yogurt', dairy_id, 'kg', 160.00, 130.00, 25, 5, false, admin_id),
    ('Cheese', 'Processed cheese', dairy_id, 'piece', 450.00, 380.00, 20, 5, false, admin_id),
    ('Butter', 'Pure butter', dairy_id, 'piece', 320.00, 280.00, 15, 3, false, admin_id),
    
    -- Fruits & Vegetables
    ('Bananas', 'Fresh bananas', fruits_id, 'dozen', 120.00, 90.00, 40, 10, true, admin_id),
    ('Apples', 'Red apples', fruits_id, 'kg', 280.00, 220.00, 35, 8, true, admin_id),
    ('Onions', 'Fresh onions', fruits_id, 'kg', 60.00, 45.00, 60, 15, false, admin_id),
    ('Tomatoes', 'Fresh tomatoes', fruits_id, 'kg', 80.00, 60.00, 45, 10, false, admin_id),
    ('Potatoes', 'Fresh potatoes', fruits_id, 'kg', 50.00, 35.00, 70, 15, false, admin_id),
    
    -- Meat & Poultry
    ('Chicken', 'Fresh chicken', meat_id, 'kg', 420.00, 350.00, 25, 5, true, admin_id),
    ('Beef', 'Fresh beef', meat_id, 'kg', 850.00, 720.00, 20, 3, false, admin_id),
    ('Fish', 'Fresh fish', meat_id, 'kg', 650.00, 550.00, 15, 3, false, admin_id),
    
    -- Beverages
    ('Coca Cola', 'Soft drink', beverages_id, 'bottle', 80.00, 60.00, 100, 20, true, admin_id),
    ('Orange Juice', 'Fresh orange juice', beverages_id, 'bottle', 150.00, 120.00, 50, 10, false, admin_id),
    ('Water Bottle', 'Mineral water', beverages_id, 'bottle', 25.00, 18.00, 200, 50, false, admin_id),
    
    -- Snacks
    ('Biscuits', 'Tea biscuits', snacks_id, 'packet', 45.00, 35.00, 80, 15, false, admin_id),
    ('Chips', 'Potato chips', snacks_id, 'packet', 65.00, 50.00, 60, 12, true, admin_id),
    ('Chocolates', 'Milk chocolates', snacks_id, 'piece', 120.00, 95.00, 40, 8, true, admin_id),
    
    -- Personal Care
    ('Soap', 'Beauty soap', personal_id, 'piece', 85.00, 65.00, 50, 10, false, admin_id),
    ('Shampoo', 'Hair shampoo', personal_id, 'bottle', 280.00, 220.00, 30, 5, false, admin_id),
    ('Toothpaste', 'Dental care', personal_id, 'tube', 120.00, 95.00, 40, 8, false, admin_id),
    
    -- Household Items
    ('Detergent', 'Washing powder', household_id, 'packet', 180.00, 150.00, 35, 8, false, admin_id),
    ('Dish Soap', 'Dishwashing liquid', household_id, 'bottle', 95.00, 75.00, 45, 10, false, admin_id),
    ('Toilet Paper', 'Tissue paper', household_id, 'roll', 65.00, 50.00, 60, 15, false, admin_id)
    ON CONFLICT (sku) DO NOTHING;

END $$;

-- Insert sample offers
INSERT INTO offers (title, description, type, value, min_order_amount, start_date, end_date, usage_limit, is_active) VALUES 
('New Year Special', '10% off on orders above Rs. 1000', 'percentage', 10.00, 1000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days', 100, true),
('Free Delivery', 'Free delivery on orders above Rs. 500', 'fixed_amount', 50.00, 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15 days', 200, true),
('Buy 2 Get 1', 'Buy 2 get 1 free on selected items', 'buy_x_get_y', 1.00, 0.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days', 50, true)
ON CONFLICT DO NOTHING;

-- Insert sample sales analytics for the last 7 days
INSERT INTO sales_analytics (date, total_orders, total_sales, total_customers, avg_order_value) VALUES 
(CURRENT_DATE - INTERVAL '6 days', 15, 12500.00, 12, 833.33),
(CURRENT_DATE - INTERVAL '5 days', 18, 15200.00, 15, 844.44),
(CURRENT_DATE - INTERVAL '4 days', 22, 18900.00, 19, 859.09),
(CURRENT_DATE - INTERVAL '3 days', 20, 16800.00, 17, 840.00),
(CURRENT_DATE - INTERVAL '2 days', 25, 21500.00, 22, 860.00),
(CURRENT_DATE - INTERVAL '1 day', 28, 24200.00, 25, 864.29),
(CURRENT_DATE, 12, 9800.00, 10, 816.67)
ON CONFLICT (date) DO UPDATE SET 
    total_orders = EXCLUDED.total_orders,
    total_sales = EXCLUDED.total_sales,
    total_customers = EXCLUDED.total_customers,
    avg_order_value = EXCLUDED.avg_order_value;

-- Insert sample notifications
INSERT INTO notifications (type, title, message, priority) VALUES 
('system', 'Database Initialized', 'Ahmed General Store database has been successfully set up with sample data.', 'normal'),
('stock', 'Low Stock Alert', 'Some products are running low on stock. Please check inventory.', 'high'),
('system', 'Welcome', 'Welcome to Ahmed General Store admin panel!', 'normal');
