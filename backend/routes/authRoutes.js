const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getProfile, updateProfile } = require('../controllers/authController');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Logout user
router.post('/logout', logoutUser);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

module.exports = router;