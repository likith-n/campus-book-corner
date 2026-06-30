import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      `SELECT 
        user_id,
        name,
        email,
        avatar_url,
        year,
        department,
        location,
        rating,
        total_ratings,
        created_at
      FROM users 
      WHERE user_id = ? AND is_active = TRUE`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const user = users[0];

    // Get user's listing stats
    const [listingStats] = await pool.execute(
      `SELECT 
        COUNT(*) as total_listings,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as active_listings,
        SUM(CASE WHEN status = 'sold' THEN 1 ELSE 0 END) as sold_listings
      FROM listings 
      WHERE user_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...user,
        stats: listingStats[0]
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching user' 
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (self only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if user is updating their own profile
    if (parseInt(id) !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this profile' 
      });
    }

    const { name, phone, year, department, location, avatar_url } = req.body;

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    if (year !== undefined) {
      updates.push('year = ?');
      params.push(year);
    }
    if (department !== undefined) {
      updates.push('department = ?');
      params.push(department);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      params.push(location);
    }
    if (avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      params.push(avatar_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No fields to update' 
      });
    }

    params.push(id);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
      params
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating profile' 
    });
  }
});

// @route   GET /api/users/:id/reviews
// @desc    Get user's reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;

    const [reviews] = await pool.execute(
      `SELECT 
        r.review_id,
        r.rating,
        r.comment,
        r.created_at,
        u.user_id as reviewer_id,
        u.name as reviewer_name,
        u.avatar_url as reviewer_avatar,
        b.title as book_title
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.user_id
      JOIN transactions t ON r.transaction_id = t.transaction_id
      JOIN listings l ON t.listing_id = l.listing_id
      JOIN books b ON l.book_id = b.book_id
      WHERE r.reviewed_user_id = ?
      ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching reviews' 
    });
  }
});

export default router;
