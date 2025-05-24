const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  genre: { type: String },
  published: { type: Number },
  isBorrowed: { type: Boolean, default: false },
  borrowedBy: { type: String, default: '' }
});

module.exports = mongoose.model('Book', bookSchema);
