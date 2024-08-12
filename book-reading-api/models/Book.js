// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }] // Reference to Chapter model
});

module.exports = mongoose.model('Book', bookSchema);