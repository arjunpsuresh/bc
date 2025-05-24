// routes/books.js
const express = require('express');
const router = express.Router();
const bookModel = require('../Model/book');

// 📘 Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, genre, published } = req.body;

    if (!title || !author || !genre || !published) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBook = new bookModel({ title, author, genre, published });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add book' });
  }
});

// 📗 Get all books (optional, if not using top-level `/books`)
router.get('/', async (req, res) => {
  try {
    const books = await bookModel.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book' });
  }
});

// ✏️ Update book by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, author, genre, published } = req.body;
    const updatedBook = await bookModel.findByIdAndUpdate(
      req.params.id,
      { title, author, genre, published },
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating book' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await bookModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book' });
  }
});


module.exports = router;
