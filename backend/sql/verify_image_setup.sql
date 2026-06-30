-- IMAGE UPLOAD SETUP VERIFICATION
-- Run this in MySQL Workbench to verify your database is ready

USE bookshare;

-- 1. Check if tables exist
SELECT 
    'booklistings' as table_name, 
    COUNT(*) as exists_check 
FROM information_schema.tables 
WHERE table_schema = 'bookshare' AND table_name = 'booklistings'
UNION ALL
SELECT 
    'listing_images', 
    COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'bookshare' AND table_name = 'listing_images'
UNION ALL
SELECT 
    'users', 
    COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'bookshare' AND table_name = 'users';

-- 2. Check listing_images table structure
DESCRIBE listing_images;

-- 3. Check if booklistings has correct columns
SHOW COLUMNS FROM booklistings LIKE '%condition%';
SHOW COLUMNS FROM booklistings LIKE '%price%';

-- 4. Test query (should work without errors)
SELECT 
    bl.listing_id,
    bl.title,
    bl.price,
    (SELECT image_url 
     FROM listing_images 
     WHERE listing_id = bl.listing_id 
     ORDER BY is_primary DESC 
     LIMIT 1) as primary_image
FROM booklistings bl
WHERE bl.status = 'available'
LIMIT 5;

-- 5. Count current listings and images
SELECT 
    (SELECT COUNT(*) FROM booklistings) as total_listings,
    (SELECT COUNT(*) FROM listing_images) as total_images,
    (SELECT COUNT(*) FROM users) as total_users;

SELECT '✅ If all queries above ran successfully, your database is ready!' as status;
SELECT '📝 Now install multer: cd backend && npm install' as next_step;
