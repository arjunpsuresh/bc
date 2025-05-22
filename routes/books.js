// backend/routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../Model/book');

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        published: req.body.published
      },
      { new: true }
    );
    if (!updatedBook) return res.status(404).send('Book not found');
    res.json(updatedBook);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
