// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  published: { type: Number, required: true },
  reserved: { type: Boolean, default: false },
  reservedBy: { type: String, default: null },
  borrowed: { type: Boolean, default: false },
  borrowedBy: { type: String, default: null },
  borrowDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
