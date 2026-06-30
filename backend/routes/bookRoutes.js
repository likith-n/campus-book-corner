const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all books
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE book_id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Search books
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = `%${req.params.query}%`;
    const [rows] = await db.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ? OR category LIKE ?',
      [searchQuery, searchQuery, searchQuery, searchQuery]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// Add new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, category, price, quantity, description, publisher, publication_year } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO books (title, author, isbn, category, price, quantity, description, publisher, publication_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, isbn, category, price, quantity, description, publisher, publication_year]
    );
    
    res.status(201).json({ 
      message: 'Book added successfully',
      book_id: result.insertId 
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const { title, author, isbn, category, price, quantity, description, publisher, publication_year } = req.body;
    
    const [result] = await db.query(
      'UPDATE books SET title = ?, author = ?, isbn = ?, category = ?, price = ?, quantity = ?, description = ?, publisher = ?, publication_year = ? WHERE book_id = ?',
      [title, author, isbn, category, price, quantity, description, publisher, publication_year, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM books WHERE book_id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Get books by category
router.get('/category/:category', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE category = ?', [req.params.category]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

module.exports = router;
