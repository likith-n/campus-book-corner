-- ============================================
-- FIXED DATABASE SCHEMA - MATCHES BACKEND ROUTES
-- ============================================

-- Drop old tables (in correct order to avoid foreign key issues)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS users;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    year VARCHAR(20),
    department VARCHAR(100),
    location VARCHAR(100) DEFAULT 'Bangalore',
    bio TEXT,
    avatar_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. BOOKS TABLE  
-- ============================================
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    edition VARCHAR(50),
    subject VARCHAR(100) NOT NULL,
    isbn VARCHAR(20),
    publisher VARCHAR(200),
    publication_year YEAR,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_subject (subject),
    INDEX idx_title (title),
    INDEX idx_author (author),
    FULLTEXT INDEX idx_search (title, author, subject, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. LISTINGS TABLE
-- ============================================
CREATE TABLE listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    condition_type ENUM('new', 'like-new', 'good', 'fair', 'acceptable') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_urls TEXT DEFAULT NULL,
    status ENUM('available', 'pending', 'sold', 'removed') DEFAULT 'available',
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    sold_at TIMESTAMP NULL,
    
    FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    INDEX idx_book (book_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. REQUESTS TABLE
-- ============================================
CREATE TABLE requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    listing_id INT NOT NULL,
    requester_id INT NOT NULL,
    owner_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (requester_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    INDEX idx_listing (listing_id),
    INDEX idx_requester (requester_id),
    INDEX idx_owner (owner_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    
    -- Prevent duplicate pending requests
    UNIQUE KEY unique_active_request (listing_id, requester_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (request_id) REFERENCES requests(request_id) ON DELETE RESTRICT,
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE RESTRICT,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    
    INDEX idx_buyer (buyer_id),
    INDEX idx_seller (seller_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. INSERT SAMPLE USERS
-- ============================================
-- Password for all users: password123
-- Hash generated with: bcrypt.hash('password123', 10)

INSERT INTO users (username, email, password_hash, name, phone, year, department, location, rating, total_ratings, bio) VALUES
('likith', 'likith@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Likith N', '9876543210', '3rd Year', 'Computer Science', 'Bangalore', 4.8, 15, 'CS student passionate about algorithms and data structures. Looking to exchange technical books.'),
('john_doe', 'john@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'John Doe', '9876543211', '2nd Year', 'Mechanical Engineering', 'Bangalore', 4.5, 10, 'Mechanical engineering student interested in design and manufacturing.'),
('jane_smith', 'jane@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane Smith', '9876543212', '4th Year', 'Chemistry', 'Bangalore', 4.7, 12, 'Final year chemistry student. Have many chemistry and biology books to exchange.'),
('bob_wilson', 'bob@college.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Bob Wilson', '9876543213', '1st Year', 'Electrical Engineering', 'Bangalore', 4.2, 8, 'First year EE student looking for circuit and electronics books.');

-- ============================================
-- 7. INSERT SAMPLE BOOKS
-- ============================================
INSERT INTO books (title, author, edition, subject, isbn, publisher, publication_year, description) VALUES
('Organic Chemistry', 'Paula Yurkanis Bruice', '7th Edition', 'Chemistry', '9780321803221', 'Pearson', 2013, 'Comprehensive organic chemistry textbook covering all major topics with clear explanations and practice problems.'),
('Introduction to Algorithms', 'Thomas H. Cormen', '3rd Edition', 'Computer Science', '9780262033848', 'MIT Press', 2009, 'The definitive guide to algorithms. Covers algorithm design and analysis with mathematical rigor.'),
('Engineering Mechanics', 'R.C. Hibbeler', '13th Edition', 'Mechanical Engineering', '9780133915389', 'Pearson', 2015, 'Foundational text for engineering mechanics covering statics and dynamics.'),
('Electric Circuits', 'James Nilsson', '10th Edition', 'Electrical Engineering', '9780133760033', 'Pearson', 2014, 'Comprehensive introduction to circuit analysis techniques.'),
('Campbell Biology', 'Jane B. Reece', '9th Edition', 'Biology', '9780321558237', 'Benjamin Cummings', 2011, 'The most widely used biology textbook covering all aspects of biological science.'),
('Calculus', 'James Stewart', '8th Edition', 'Mathematics', '9781285740621', 'Cengage', 2015, 'Clear and comprehensive calculus textbook with excellent problem sets.'),
('Database System Concepts', 'Abraham Silberschatz', '6th Edition', 'Computer Science', '9780073523323', 'McGraw-Hill', 2010, 'Comprehensive database systems textbook covering theory and practice.'),
('Physics for Scientists', 'Randall D. Knight', '4th Edition', 'Physics', '9780133942651', 'Pearson', 2016, 'Algebra-based physics textbook with clear explanations and real-world applications.');

-- ============================================
-- 8. INSERT SAMPLE LISTINGS
-- ============================================
INSERT INTO listings (book_id, user_id, condition_type, price, description, status, views) VALUES
-- Likith's listings
(1, 1, 'good', 450, 'Well-maintained chemistry textbook. Minor highlighting in first 3 chapters. All pages intact, no tears. Perfect for organic chemistry course.', 'available', 45),
(2, 1, 'fair', 380, 'Algorithms book with some wear and tear. Some pencil marks and highlighting. Cover has minor damage but all pages are present and readable.', 'available', 67),
(7, 1, 'good', 420, 'Database systems book in good condition. Some light highlighting. Great for DBMS course.', 'available', 23),

-- John's listings
(3, 2, 'new', 520, 'Brand new mechanics book. Shrink wrap removed but never read. Perfect condition, no marks or damage whatsoever.', 'available', 89),
(4, 2, 'good', 400, 'Circuits textbook in good condition. Minor highlighting in chapters 1-5. Back cover has slight wear. Otherwise excellent.', 'available', 34),

-- Jane's listings
(5, 3, 'good', 380, 'Biology textbook with some notes in margins. Notes are helpful for understanding concepts. All pages intact.', 'available', 56),
(6, 3, 'fair', 320, 'Calculus book with highlighting throughout. Some pencil work in margins. Cover shows wear but pages are good.', 'available', 41),

-- Bob's listings
(8, 4, 'good', 390, 'Physics textbook in good condition. Used for one semester. Minimal marking, mostly clean.', 'available', 28);

-- ============================================
-- 9. INSERT SAMPLE REQUESTS
-- ============================================
INSERT INTO requests (listing_id, requester_id, owner_id, message, status) VALUES
(1, 2, 1, 'Hi! I need this book for my organic chemistry course next semester. Is it still available? Can we meet at the library?', 'pending'),
(3, 1, 2, 'Interested in this mechanics book. Can we meet tomorrow at the engineering block? I can pay the full price.', 'accepted'),
(5, 1, 3, 'Hi Jane! I need this biology book. Is the price negotiable? Can you do ₹350?', 'pending'),
(4, 3, 2, 'Hi! I need this circuits book for my course. When can we meet?', 'pending');

-- ============================================
-- 10. CREATE USEFUL VIEWS
-- ============================================

-- View for listings with all details
CREATE OR REPLACE VIEW v_listings_full AS
SELECT 
    l.listing_id,
    l.price,
    l.condition_type,
    l.description as listing_description,
    l.image_urls,
    l.status,
    l.views,
    l.created_at,
    l.updated_at,
    b.book_id,
    b.title,
    b.author,
    b.edition,
    b.subject,
    b.isbn,
    b.publisher,
    b.publication_year,
    b.description as book_description,
    u.user_id as owner_id,
    u.username as owner_username,
    u.name as owner_name,
    u.email as owner_email,
    u.phone as owner_phone,
    u.rating as owner_rating,
    u.total_ratings as owner_total_ratings,
    u.year as owner_year,
    u.department as owner_department,
    u.location as owner_location
FROM listings l
JOIN books b ON l.book_id = b.book_id
JOIN users u ON l.user_id = u.user_id;

-- View for requests with all details
CREATE OR REPLACE VIEW v_requests_full AS
SELECT 
    r.request_id,
    r.listing_id,
    r.requester_id,
    r.owner_id,
    r.message,
    r.status,
    r.created_at,
    r.updated_at,
    b.title as book_title,
    b.author as book_author,
    b.subject as book_subject,
    b.edition as book_edition,
    l.price as book_price,
    l.condition_type as book_condition,
    requester.name as requester_name,
    requester.email as requester_email,
    requester.phone as requester_phone,
    requester.rating as requester_rating,
    requester.year as requester_year,
    requester.department as requester_department,
    owner.name as owner_name,
    owner.email as owner_email,
    owner.phone as owner_phone,
    owner.rating as owner_rating
FROM requests r
JOIN listings l ON r.listing_id = l.listing_id
JOIN books b ON l.book_id = b.book_id
JOIN users requester ON r.requester_id = requester.user_id
JOIN users owner ON r.owner_id = owner.user_id;

-- ============================================
-- 11. VERIFICATION QUERIES
-- ============================================

SELECT '✅ Database setup complete!' as Status;
SELECT '' as '';
SELECT 'DATA SUMMARY:' as Info;
SELECT CONCAT(COUNT(*), ' users created') as Users FROM users;
SELECT CONCAT(COUNT(*), ' books created') as Books FROM books;
SELECT CONCAT(COUNT(*), ' listings created') as Listings FROM listings;
SELECT CONCAT(COUNT(*), ' requests created') as Requests FROM requests;
SELECT '' as '';
SELECT '🎯 Ready to use!' as Status;
SELECT 'Default login: likith@college.edu / password123' as Credentials;
