-- Add image_urls column to listings table (MySQL compatible)
-- First, check if column exists and add it if it doesn't

-- For MySQL 8.0+, this will work:
ALTER TABLE listings 
ADD COLUMN image_urls TEXT;

-- If you get "Duplicate column" error, that's OK - column already exists!

-- Update existing listings with placeholder images based on subject
UPDATE listings l
JOIN books b ON l.book_id = b.book_id
SET l.image_urls = CASE 
  WHEN b.subject = 'Chemistry' THEN 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400'
  WHEN b.subject = 'Physics' THEN 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400'
  WHEN b.subject = 'Mathematics' THEN 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
  WHEN b.subject = 'Computer Science' THEN 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400'
  ELSE 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
END
WHERE l.image_urls IS NULL OR l.image_urls = '';

-- Show updated listings
SELECT l.listing_id, b.title, b.subject, l.image_urls 
FROM listings l
JOIN books b ON l.book_id = b.book_id
LIMIT 10;
