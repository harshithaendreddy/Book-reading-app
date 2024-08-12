// models/Chapter.js
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }, // Reference to Book model
});

module.exports = mongoose.model('Chapter', chapterSchema);