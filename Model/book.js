const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  published: Number,
  borrowed: { type: Boolean, default: false },
  borrowedBy: { type: String, default: '' },
  borrowDate: { type: String, default: '' }
});

module.exports = mongoose.model('Book', bookSchema);
