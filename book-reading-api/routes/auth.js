const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).send({ error: 'All fields are required' });
  }
  try {
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).send({ message: 'User registered' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


// User Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ error: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'hello', { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
