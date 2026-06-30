-- ============================================
-- CAMPUS BOOK CORNER - COMPLETE DATABASE SCHEMA
-- ============================================

-- Drop existing tables (be careful in production!)
DROP TABLE IF EXISTS book_requests;
DROP TABLE IF EXISTS listing_images;
DROP TABLE IF EXISTS booklistings;
DROP TABLE IF EXISTS users;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    profile_image_url VARCHAR(500),
    bio TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    listings_count INT DEFAULT 0,
    successful_transactions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. BOOK LISTINGS TABLE
-- ============================================
CREATE TABLE booklistings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    edition VARCHAR(50),
    subject VARCHAR(100) NOT NULL,
    publication_year YEAR,
    publisher VARCHAR(200),
    
    -- Pricing and Condition
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    condition_type ENUM('new', 'like-new', 'good', 'fair', 'acceptable') NOT NULL,
    
    -- Description
    listing_description TEXT,
    condition_details TEXT,
    
    -- Status and Visibility
    status ENUM('available', 'pending', 'sold', 'removed') DEFAULT 'available',
    is_negotiable BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    sold_at TIMESTAMP NULL,
    
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_owner (owner_id),
    INDEX idx_status (status),
    INDEX idx_subject (subject),
    INDEX idx_price (price),
    INDEX idx_created_at (created_at),
    INDEX idx_title (title),
    
    -- Full-text search index
    FULLTEXT INDEX idx_search (title, author, subject, listing_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. LISTING IMAGES TABLE
-- ============================================
CREATE TABLE listing_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (listing_id) REFERENCES booklistings(listing_id) ON DELETE CASCADE,
    INDEX idx_listing (listing_id),
    INDEX idx_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. BOOK REQUESTS TABLE
-- ============================================
CREATE TABLE book_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    requester_id INT NOT NULL,
    owner_id INT NOT NULL,
    
    -- Request details
    message TEXT,
    offered_price DECIMAL(10,2),
    
    -- Status tracking
    status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    
    -- Meeting details (when accepted)
    meeting_location VARCHAR(255),
    meeting_time TIMESTAMP NULL,
    meeting_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- Response from owner
    response_message TEXT,
    
    FOREIGN KEY (listing_id) REFERENCES booklistings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    INDEX idx_listing (listing_id),
    INDEX idx_requester (requester_id),
    INDEX idx_owner (owner_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    
    -- Prevent duplicate pending requests
    UNIQUE KEY unique_pending_request (listing_id, requester_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. CREATE VIEWS FOR EASY QUERYING
-- ============================================

-- View: Listings with owner info
CREATE OR REPLACE VIEW v_listings_with_owner AS
SELECT 
    bl.*,
    u.username AS owner_name,
    u.email AS owner_email,
    u.phone_number AS owner_phone,
    u.rating AS owner_rating,
    u.total_ratings AS owner_total_ratings,
    u.successful_transactions AS owner_transactions,
    (SELECT image_url FROM listing_images WHERE listing_id = bl.listing_id AND is_primary = TRUE LIMIT 1) AS primary_image,
    (SELECT COUNT(*) FROM listing_images WHERE listing_id = bl.listing_id) AS image_count
FROM booklistings bl
JOIN users u ON bl.owner_id = u.user_id;

-- View: Requests with full details
CREATE OR REPLACE VIEW v_requests_detailed AS
SELECT 
    br.*,
    bl.title AS book_title,
    bl.author AS book_author,
    bl.price AS book_price,
    bl.subject AS book_subject,
    bl.condition_type AS book_condition,
    requester.username AS requester_name,
    requester.email AS requester_email,
    requester.phone_number AS requester_phone,
    requester.rating AS requester_rating,
    owner.username AS owner_name,
    owner.email AS owner_email,
    owner.phone_number AS owner_phone
FROM book_requests br
JOIN booklistings bl ON br.listing_id = bl.listing_id
JOIN users requester ON br.requester_id = requester.user_id
JOIN users owner ON br.owner_id = owner.user_id;

-- ============================================
-- 6. SAMPLE DATA FOR TESTING
-- ============================================

-- Insert sample users
INSERT INTO users (username, email, password_hash, full_name, phone_number, rating, total_ratings) VALUES
('john_doe', 'john@example.com', '$2b$10$rKzZ3eQs.HGhGVYLhq8ixOxG5xUZjz.vGVxb.K8nYlFn8WjQkS7Ae', 'John Doe', '9876543210', 4.5, 10),
('jane_smith', 'jane@example.com', '$2b$10$rKzZ3eQs.HGhGVYLhq8ixOxG5xUZjz.vGVxb.K8nYlFn8WjQkS7Ae', 'Jane Smith', '9876543211', 4.8, 15),
('bob_wilson', 'bob@example.com', '$2b$10$rKzZ3eQs.HGhGVYLhq8ixOxG5xUZjz.vGVxb.K8nYlFn8WjQkS7Ae', 'Bob Wilson', '9876543212', 4.2, 8);

-- Insert sample listings
INSERT INTO booklistings (owner_id, title, author, isbn, edition, subject, publication_year, publisher, price, original_price, condition_type, listing_description, condition_details, is_negotiable) VALUES
(1, 'Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', '3rd Edition', 'Computer Science', 2009, 'MIT Press', 450, 1200, 'good', 'Classic computer science textbook. Great condition with minimal highlighting.', 'Some pencil marks, all pages intact', TRUE),
(1, 'Organic Chemistry', 'Paula Yurkanis Bruice', '9780321803221', '7th Edition', 'Chemistry', 2013, 'Pearson', 350, 950, 'fair', 'Well-used but functional. Good for reference.', 'Some wear on cover, pages slightly yellowed', TRUE),
(2, 'Engineering Mechanics', 'R.C. Hibbeler', '9780133915389', '13th Edition', 'Mechanical Engineering', 2015, 'Pearson', 500, 1100, 'like-new', 'Barely used, like new condition', 'No marks or highlights', FALSE),
(2, 'Electric Circuits', 'James Nilsson', '9780133760033', '10th Edition', 'Electrical Engineering', 2014, 'Pearson', 420, 1000, 'good', 'Comprehensive circuits textbook', 'Minor highlighting in first few chapters', TRUE),
(3, 'Campbell Biology', 'Jane B. Reece', '9780321558237', '9th Edition', 'Biology', 2011, 'Benjamin Cummings', 380, 1300, 'good', 'Essential biology textbook', 'Some notes in margins', TRUE);

-- Insert sample images
INSERT INTO listing_images (listing_id, image_url, image_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 0, TRUE),
(2, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 0, TRUE),
(3, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 0, TRUE),
(4, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 0, TRUE),
(5, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 0, TRUE);

-- Insert sample requests
INSERT INTO book_requests (listing_id, requester_id, owner_id, message, offered_price, status) VALUES
(1, 2, 1, 'Hi! I need this book for my algorithms course. Is it still available?', 450, 'pending'),
(3, 1, 2, 'Interested in this book. Can we meet at the library?', 500, 'accepted'),
(5, 1, 3, 'Is the price negotiable?', 350, 'pending');

-- ============================================
-- 7. STORED PROCEDURES (Optional but useful)
-- ============================================

DELIMITER //

-- Procedure to create a new listing
CREATE PROCEDURE create_listing(
    IN p_owner_id INT,
    IN p_title VARCHAR(255),
    IN p_author VARCHAR(255),
    IN p_edition VARCHAR(50),
    IN p_subject VARCHAR(100),
    IN p_price DECIMAL(10,2),
    IN p_condition_type VARCHAR(20),
    IN p_description TEXT
)
BEGIN
    INSERT INTO booklistings (
        owner_id, title, author, edition, subject, 
        price, condition_type, listing_description
    ) VALUES (
        p_owner_id, p_title, p_author, p_edition, p_subject,
        p_price, p_condition_type, p_description
    );
    
    -- Update user's listings count
    UPDATE users 
    SET listings_count = listings_count + 1 
    WHERE user_id = p_owner_id;
    
    SELECT LAST_INSERT_ID() as listing_id;
END //

-- Procedure to create a request
CREATE PROCEDURE create_request(
    IN p_listing_id INT,
    IN p_requester_id INT,
    IN p_message TEXT,
    IN p_offered_price DECIMAL(10,2)
)
BEGIN
    DECLARE v_owner_id INT;
    
    -- Get the owner of the listing
    SELECT owner_id INTO v_owner_id 
    FROM booklistings 
    WHERE listing_id = p_listing_id;
    
    -- Insert the request
    INSERT INTO book_requests (
        listing_id, requester_id, owner_id, 
        message, offered_price
    ) VALUES (
        p_listing_id, p_requester_id, v_owner_id,
        p_message, p_offered_price
    );
    
    SELECT LAST_INSERT_ID() as request_id;
END //

-- Procedure to complete a transaction
CREATE PROCEDURE complete_transaction(
    IN p_request_id INT
)
BEGIN
    DECLARE v_listing_id INT;
    DECLARE v_owner_id INT;
    DECLARE v_requester_id INT;
    
    -- Get request details
    SELECT listing_id, owner_id, requester_id 
    INTO v_listing_id, v_owner_id, v_requester_id
    FROM book_requests 
    WHERE request_id = p_request_id;
    
    -- Update request status
    UPDATE book_requests 
    SET status = 'completed', completed_at = CURRENT_TIMESTAMP
    WHERE request_id = p_request_id;
    
    -- Mark listing as sold
    UPDATE booklistings 
    SET status = 'sold', sold_at = CURRENT_TIMESTAMP
    WHERE listing_id = v_listing_id;
    
    -- Update transaction counts
    UPDATE users 
    SET successful_transactions = successful_transactions + 1
    WHERE user_id IN (v_owner_id, v_requester_id);
END //

DELIMITER ;

-- ============================================
-- 8. TRIGGERS FOR DATA INTEGRITY
-- ============================================

DELIMITER //

-- Auto-update listing status when request is accepted
CREATE TRIGGER after_request_accepted
AFTER UPDATE ON book_requests
FOR EACH ROW
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        UPDATE booklistings 
        SET status = 'pending'
        WHERE listing_id = NEW.listing_id;
    END IF;
END //

-- Increment views count
CREATE TRIGGER before_listing_view
BEFORE UPDATE ON booklistings
FOR EACH ROW
BEGIN
    IF NEW.views_count > OLD.views_count THEN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
END //

DELIMITER ;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'booklistings', COUNT(*) FROM booklistings
UNION ALL
SELECT 'listing_images', COUNT(*) FROM listing_images
UNION ALL
SELECT 'book_requests', COUNT(*) FROM book_requests;

-- Show all views
SELECT TABLE_NAME 
FROM information_schema.VIEWS 
WHERE TABLE_SCHEMA = DATABASE();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT '✅ Database schema created successfully!' as message;
SELECT '📚 Sample data inserted!' as message;
SELECT '🎯 Ready to use!' as message;
