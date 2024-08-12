const express = require('express');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');
const auth = require('../middleware/auth'); // Import the auth middleware
const router = express.Router();

// Get all books
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find().populate('author', 'username');
    res.send(books);
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Get a book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author', 'username') // Populate author if needed
      .populate('chapters'); // Populate chapters
    if (!book) return res.status(404).send({ error: 'Book not found' });
    res.send(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});
// Add a new book
router.post('/', auth, async (req, res) => {
  const { title } = req.body; // Author will be set from req.user
  if (!title) {
    return res.status(400).send({ error: 'Title is required' });
  }
  try {
    const book = new Book({ title, author: req.user._id }); // Use the authenticated user's ID
    await book.save();
    res.status(201).send(book);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// routes/books.js
router.post('/:id/chapters', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send({ error: 'Title and content are required' });
  }
  try {
    const chapter = new Chapter({ title, content, book: req.params.id });
    await chapter.save();

    // Optionally, push the chapter ID to the book's chapters array
    await Book.findByIdAndUpdate(req.params.id, { $push: { chapters: chapter._id } });

    res.status(201).send(chapter);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
router.get('/:id/chapters/:chapterId', async (req, res) => {
  const { id, chapterId } = req.params;
  try {
    const chapter = await Chapter.findOne({ _id: chapterId, book: id });
    if (!chapter) {
      return res.status(404).send({ error: 'Chapter not found' });
    }
    res.send(chapter);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});
module.exports = router;