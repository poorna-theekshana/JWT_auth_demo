// src/users.js

const bcrypt = require('bcryptjs');

// Simulating a database of users
const users = [
  {
    id: '1',
    username: 'admin',
    password: bcrypt.hashSync('password123', 10), // Hashed password
  },
];

// Function to find a user by username
function findUserByUsername(username) {
  return users.find(user => user.username === username);
}

module.exports = { findUserByUsername };
