require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});