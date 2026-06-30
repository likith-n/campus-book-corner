const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT o.*, u.username, u.email, u.full_name 
      FROM orders o 
      JOIN users u ON o.user_id = u.user_id 
      ORDER BY o.order_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID with order items
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.username, u.email, u.full_name, u.phone, u.address 
      FROM orders o 
      JOIN users u ON o.user_id = u.user_id 
      WHERE o.order_id = ?
    `, [req.params.id]);
    
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const [items] = await db.query(`
      SELECT oi.*, b.title, b.author, b.isbn 
      FROM order_items oi 
      JOIN books b ON oi.book_id = b.book_id 
      WHERE oi.order_id = ?
    `, [req.params.id]);
    
    res.json({
      ...orders[0],
      items: items
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY order_date DESC
    `, [req.params.userId]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { user_id, total_amount, items } = req.body;
    
    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [user_id, total_amount, 'pending']
    );
    
    const order_id = orderResult.insertId;
    
    // Add order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.book_id, item.quantity, item.price]
      );
      
      // Update book quantity
      await connection.query(
        'UPDATE books SET quantity = quantity - ? WHERE book_id = ?',
        [item.quantity, item.book_id]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({ 
      message: 'Order placed successfully',
      order_id: order_id
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Cancel order
router.delete('/:id', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Get order items
    const [items] = await connection.query(
      'SELECT book_id, quantity FROM order_items WHERE order_id = ?',
      [req.params.id]
    );
    
    // Restore book quantities
    for (const item of items) {
      await connection.query(
        'UPDATE books SET quantity = quantity + ? WHERE book_id = ?',
        [item.quantity, item.book_id]
      );
    }
    
    // Delete order items
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [req.params.id]);
    
    // Delete order
    const [result] = await connection.query('DELETE FROM orders WHERE order_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }
    
    await connection.commit();
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  } finally {
    connection.release();
  }
});

module.exports = router;
