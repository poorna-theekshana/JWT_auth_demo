// src/app.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByUsername } = require('./users');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'supersecretkey'; // Use a strong secret key for production

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Route for login - generates a JWT if credentials are correct
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = findUserByUsername(username);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  // Generate a JWT
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  res.json({ message: 'Login successful', token });
});

// Protected route - requires a valid JWT to access
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome to the dashboard, ${req.user.username}!` });
});

// Middleware to verify the JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
