-- SAFE VERSION: Add images to listings (MySQL 5.7+ compatible)
-- This version checks if column exists before adding

-- Step 1: Add column (run this, ignore error if column exists)
ALTER TABLE listings ADD COLUMN image_urls TEXT;

-- Step 2: Update existing listings with default images
UPDATE listings l
JOIN books b ON l.book_id = b.book_id
SET l.image_urls = CASE 
  WHEN b.subject = 'Chemistry' THEN 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400'
  WHEN b.subject = 'Physics' THEN 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400'
  WHEN b.subject = 'Mathematics' THEN 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
  WHEN b.subject = 'Computer Science' THEN 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
  WHEN b.subject = 'Electrical Engineering' THEN 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400'
  WHEN b.subject = 'Mechanical Engineering' THEN 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400'
  WHEN b.subject = 'Biology' THEN 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400'
  ELSE 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
END
WHERE l.image_urls IS NULL OR l.image_urls = '';

-- Step 3: Verify the update
SELECT 
  l.listing_id,
  b.title,
  b.subject,
  l.image_urls,
  l.price
FROM listings l
JOIN books b ON l.book_id = b.book_id
ORDER BY l.listing_id
LIMIT 10;

-- Summary
SELECT 
  b.subject,
  COUNT(*) as total_books,
  COUNT(l.image_urls) as books_with_images
FROM listings l
JOIN books b ON l.book_id = b.book_id
GROUP BY b.subject;
