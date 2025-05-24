const express = require('express');
const router = express.Router();
const Book = require('../Model/book');

router.post('/:id/reserve', async (req, res) => {
  const { username } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (book.reserved) {
      return res.status(400).json({ error: 'Book is already reserved' });
    }

    book.reserved = true;
    book.reservedBy = username;
    await book.save();

    res.json({ message: 'Book reserved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reserve book' });
  }
});

module.exports = router;
