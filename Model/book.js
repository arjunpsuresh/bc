const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  published: Number,
  reserved: { type: Boolean, default: false },
  reservedBy: { type: String, default: '' },
  reservedDate: { type: String, default: '' }
});

module.exports = mongoose.model('Book', bookSchema);
