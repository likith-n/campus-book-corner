import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/requests
// @desc    Create new book request
// @access  Private
router.post('/',
  authenticateToken,
  [
    body('listing_id').isInt().withMessage('Valid listing ID is required'),
    body('message').optional().trim()
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

      const { listing_id, message } = req.body;
      const requesterId = req.user.userId;

      // Get listing details and owner
      const [listings] = await pool.execute(
        'SELECT user_id, status FROM listings WHERE listing_id = ?',
        [listing_id]
      );

      if (listings.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Listing not found' 
        });
      }

      const ownerId = listings[0].user_id;

      // Check if user is trying to request their own listing
      if (ownerId === requesterId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot request your own listing' 
        });
      }

      // Check if listing is available
      if (listings[0].status !== 'available') {
        return res.status(400).json({ 
          success: false, 
          message: 'Listing is not available' 
        });
      }

      // Check if request already exists
      const [existingRequests] = await pool.execute(
        'SELECT request_id FROM requests WHERE listing_id = ? AND requester_id = ? AND status IN ("pending", "accepted")',
        [listing_id, requesterId]
      );

      if (existingRequests.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'You already have a pending/accepted request for this listing' 
        });
      }

      // Create request
      const [result] = await pool.execute(
        'INSERT INTO requests (listing_id, requester_id, owner_id, message) VALUES (?, ?, ?, ?)',
        [listing_id, requesterId, ownerId, message || null]
      );

      res.status(201).json({
        success: true,
        message: 'Request sent successfully',
        data: {
          request_id: result.insertId
        }
      });

    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error creating request' 
      });
    }
  }
);

// @route   GET /api/requests/sent
// @desc    Get requests sent by user
// @access  Private
router.get('/sent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [requests] = await pool.execute(
      `SELECT 
        r.request_id,
        r.message,
        r.status,
        r.created_at,
        r.updated_at,
        l.listing_id,
        l.price,
        l.condition_type,
        b.title as book_title,
        b.author as book_author,
        b.edition as book_edition,
        u.user_id as owner_id,
        u.name as owner_name,
        u.rating as owner_rating,
        u.location as owner_location
      FROM requests r
      JOIN listings l ON r.listing_id = l.listing_id
      JOIN books b ON l.book_id = b.book_id
      JOIN users u ON r.owner_id = u.user_id
      WHERE r.requester_id = ?
      ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching sent requests' 
    });
  }
});

// @route   GET /api/requests/received
// @desc    Get requests received by user
// @access  Private
router.get('/received', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [requests] = await pool.execute(
      `SELECT 
        r.request_id,
        r.message,
        r.status,
        r.created_at,
        r.updated_at,
        l.listing_id,
        l.price,
        l.condition_type,
        b.title as book_title,
        b.author as book_author,
        b.edition as book_edition,
        u.user_id as requester_id,
        u.name as requester_name,
        u.rating as requester_rating,
        u.location as requester_location,
        u.email as requester_email,
        u.phone as requester_phone
      FROM requests r
      JOIN listings l ON r.listing_id = l.listing_id
      JOIN books b ON l.book_id = b.book_id
      JOIN users u ON r.requester_id = u.user_id
      WHERE r.owner_id = ?
      ORDER BY 
        CASE r.status
          WHEN 'pending' THEN 1
          WHEN 'accepted' THEN 2
          ELSE 3
        END,
        r.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get received requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching received requests' 
    });
  }
});

// @route   PATCH /api/requests/:id/accept
// @desc    Accept a request
// @access  Private (owner only)
router.patch('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if request exists and user is owner
    const [requests] = await pool.execute(
      'SELECT * FROM requests WHERE request_id = ?',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    const request = requests[0];

    if (request.owner_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to accept this request' 
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Request is not pending' 
      });
    }

    // Update request status
    await pool.execute(
      'UPDATE requests SET status = "accepted" WHERE request_id = ?',
      [id]
    );

    // Update listing status to pending
    await pool.execute(
      'UPDATE listings SET status = "pending" WHERE listing_id = ?',
      [request.listing_id]
    );

    res.json({
      success: true,
      message: 'Request accepted successfully'
    });

  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error accepting request' 
    });
  }
});

// @route   PATCH /api/requests/:id/reject
// @desc    Reject a request
// @access  Private (owner only)
router.patch('/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if request exists and user is owner
    const [requests] = await pool.execute(
      'SELECT * FROM requests WHERE request_id = ?',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    const request = requests[0];

    if (request.owner_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to reject this request' 
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Request is not pending' 
      });
    }

    // Update request status
    await pool.execute(
      'UPDATE requests SET status = "rejected" WHERE request_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Request rejected'
    });

  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error rejecting request' 
    });
  }
});

// @route   PATCH /api/requests/:id/complete
// @desc    Mark request as completed (creates transaction)
// @access  Private (owner only)
router.patch('/:id/complete', 
  authenticateToken,
  [
    body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
    body('payment_method').optional().trim(),
    body('notes').optional().trim()
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

      const { id } = req.params;
      const userId = req.user.userId;
      const { amount, payment_method, notes } = req.body;

      // Check if request exists and user is owner
      const [requests] = await pool.execute(
        'SELECT * FROM requests WHERE request_id = ?',
        [id]
      );

      if (requests.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Request not found' 
        });
      }

      const request = requests[0];

      if (request.owner_id !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to complete this request' 
        });
      }

      if (request.status !== 'accepted') {
        return res.status(400).json({ 
          success: false, 
          message: 'Request must be accepted before completing' 
        });
      }

      // Create transaction
      const [transactionResult] = await pool.execute(
        'INSERT INTO transactions (request_id, listing_id, buyer_id, seller_id, amount, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, request.listing_id, request.requester_id, request.owner_id, amount, payment_method || null, notes || null]
      );

      // Update request status
      await pool.execute(
        'UPDATE requests SET status = "completed" WHERE request_id = ?',
        [id]
      );

      // Update listing status to sold
      await pool.execute(
        'UPDATE listings SET status = "sold" WHERE listing_id = ?',
        [request.listing_id]
      );

      res.json({
        success: true,
        message: 'Transaction completed successfully',
        data: {
          transaction_id: transactionResult.insertId
        }
      });

    } catch (error) {
      console.error('Complete request error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error completing request' 
      });
    }
  }
);

// @route   DELETE /api/requests/:id
// @desc    Cancel a request
// @access  Private (requester only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if request exists and user is requester
    const [requests] = await pool.execute(
      'SELECT * FROM requests WHERE request_id = ?',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Request not found' 
      });
    }

    const request = requests[0];

    if (request.requester_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this request' 
      });
    }

    if (request.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel completed request' 
      });
    }

    // Update request status
    await pool.execute(
      'UPDATE requests SET status = "cancelled" WHERE request_id = ?',
      [id]
    );

    // If request was accepted, mark listing as available again
    if (request.status === 'accepted') {
      await pool.execute(
        'UPDATE listings SET status = "available" WHERE listing_id = ?',
        [request.listing_id]
      );
    }

    res.json({
      success: true,
      message: 'Request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error cancelling request' 
    });
  }
});

export default router;
