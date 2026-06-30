import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 TEST endpoint called');
    const [result] = await pool.query('SELECT COUNT(*) as count FROM listings WHERE status = "available"');
    res.json({
      success: true,
      message: 'Database connection works!',
      availableListings: result[0].count
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/listings
// @desc    Get all listings with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📝 GET /api/listings called');
    console.log('Query params:', req.query);

    const { 
      subject, 
      condition, 
      priceMin, 
      priceMax, 
      search, 
      sortBy = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    // Build base query
    let query = `
      SELECT 
        l.listing_id,
        l.price,
        l.condition_type,
        l.description as listing_description,
        l.image_urls,
        l.status,
        l.views,
        l.created_at,
        b.book_id,
        b.title,
        b.author,
        b.edition,
        b.subject,
        b.publisher,
        u.user_id as owner_id,
        u.name as owner_name,
        u.rating as owner_rating,
        u.location as owner_location
      FROM listings l
      JOIN books b ON l.book_id = b.book_id
      JOIN users u ON l.user_id = u.user_id
      WHERE l.status = 'available'
    `;

    const queryParams = [];

    // Add filters
    if (subject) {
      query += ' AND b.subject = ?';
      queryParams.push(subject);
    }

    if (condition) {
      query += ' AND l.condition_type = ?';
      queryParams.push(condition);
    }

    if (priceMin) {
      query += ' AND l.price >= ?';
      queryParams.push(parseFloat(priceMin));
    }

    if (priceMax) {
      query += ' AND l.price <= ?';
      queryParams.push(parseFloat(priceMax));
    }

    if (search) {
      query += ' AND (b.title LIKE ? OR b.author LIKE ? OR b.subject LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Add sorting
    switch (sortBy) {
      case 'price-low':
        query += ' ORDER BY l.price ASC';
        break;
      case 'price-high':
        query += ' ORDER BY l.price DESC';
        break;
      case 'popular':
        query += ' ORDER BY l.views DESC';
        break;
      case 'newest':
      default:
        query += ' ORDER BY l.created_at DESC';
    }

    // Add pagination using LIMIT and OFFSET separately
    const parsedLimit = Math.min(parseInt(limit) || 20, 100); // Max 100
    const parsedPage = parseInt(page) || 1;
    const offset = (parsedPage - 1) * parsedLimit;
    
    query += ` LIMIT ${parsedLimit} OFFSET ${offset}`;

    console.log('🔍 Executing query');
    console.log('Query params:', queryParams);

    // Use query instead of execute to avoid parameter issues
    const [listings] = await pool.query(query, queryParams);
    
    console.log('✅ Query successful, found', listings.length, 'listings');

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM listings l JOIN books b ON l.book_id = b.book_id WHERE l.status = "available"';
    const countParams = [];
    
    if (subject) {
      countQuery += ' AND b.subject = ?';
      countParams.push(subject);
    }
    if (condition) {
      countQuery += ' AND l.condition_type = ?';
      countParams.push(condition);
    }
    if (priceMin) {
      countQuery += ' AND l.price >= ?';
      countParams.push(parseFloat(priceMin));
    }
    if (priceMax) {
      countQuery += ' AND l.price <= ?';
      countParams.push(parseFloat(priceMax));
    }
    if (search) {
      countQuery += ' AND (b.title LIKE ? OR b.author LIKE ? OR b.subject LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    console.log('📊 Total listings:', total);

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          totalPages: Math.ceil(total / parsedLimit)
        }
      }
    });

  } catch (error) {
    console.error('❌ ❌ ❌ Get listings error:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('SQL Message:', error.sqlMessage);
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching listings',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📖 Getting listing:', id);

    const [listings] = await pool.query(
      `SELECT 
        l.*,
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
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone,
        u.rating as owner_rating,
        u.total_ratings as owner_total_ratings,
        u.year as owner_year,
        u.department as owner_department,
        u.location as owner_location,
        u.avatar_url as owner_avatar
      FROM listings l
      JOIN books b ON l.book_id = b.book_id
      JOIN users u ON l.user_id = u.user_id
      WHERE l.listing_id = ?`,
      [id]
    );

    if (listings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Listing not found' 
      });
    }

    // Increment view count
    await pool.query(
      'UPDATE listings SET views = views + 1 WHERE listing_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: listings[0]
    });

  } catch (error) {
    console.error('❌ Get listing error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching listing' 
    });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private
router.post('/',
  authenticateToken,
  upload.array('images', 5),
  handleMulterError,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('edition').optional().trim(),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('condition').isIn(['new', 'like-new', 'good', 'fair', 'acceptable']).withMessage('Valid condition is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const {
        title,
        author,
        edition,
        subject,
        isbn,
        publisher,
        publication_year,
        condition,
        price,
        description
      } = req.body;

      const userId = req.user.userId;

      // Build image URLs from uploaded files
      const imageUrls = req.files && req.files.length > 0
        ? req.files.map(file => `/uploads/${file.filename}`)
        : [];
      const imageUrlsJson = JSON.stringify(imageUrls);

      console.log('➕ Creating listing for user:', userId);
      console.log('🖼️ Uploaded images:', imageUrls);

      // Check if book already exists
      let bookId;
      const [existingBooks] = await pool.query(
        'SELECT book_id FROM books WHERE title = ? AND author = ? AND edition = ?',
        [title, author, edition || '']
      );

      if (existingBooks.length > 0) {
        bookId = existingBooks[0].book_id;
        console.log('📚 Using existing book:', bookId);
      } else {
        // Create new book entry
        const [bookResult] = await pool.query(
          `INSERT INTO books (title, author, edition, subject, isbn, publisher, publication_year, description) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [title, author, edition || null, subject, isbn || null, publisher || null, publication_year || null, description || null]
        );
        bookId = bookResult.insertId;
        console.log('📚 Created new book:', bookId);
      }

      // Create listing with image URLs
      const [listingResult] = await pool.query(
        `INSERT INTO listings (book_id, user_id, condition_type, price, description, image_urls, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'available')`,
        [bookId, userId, condition, price, description || null, imageUrlsJson]
      );

      console.log('✅ Created listing:', listingResult.insertId);

      res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        data: {
          listing_id: listingResult.insertId,
          book_id: bookId,
          image_urls: imageUrls
        }
      });

    } catch (error) {
      console.error('❌ Create listing error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error creating listing' 
      });
    }
  }
);

// @route   GET /api/listings/user/:userId
// @desc    Get user's listings
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status = 'available' } = req.query;

    console.log('👤 Getting listings for user:', userId);

    let query = `
      SELECT 
        l.*,
        b.title,
        b.author,
        b.edition,
        b.subject
      FROM listings l
      JOIN books b ON l.book_id = b.book_id
      WHERE l.user_id = ?
    `;

    const params = [userId];

    if (status !== 'all') {
      query += ' AND l.status = ?';
      params.push(status);
    }

    query += ' ORDER BY l.created_at DESC';

    const [listings] = await pool.query(query, params);

    res.json({
      success: true,
      data: listings
    });

  } catch (error) {
    console.error('❌ Get user listings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching user listings' 
    });
  }
});

export default router;
