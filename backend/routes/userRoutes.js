const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getAllUsers, getUserById, searchUsers } = require('../controllers/userController');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all users/contacts
router.get('/', getAllUsers);

// Get specific user
router.get('/:userId', getUserById);

// Search users
router.post('/search', searchUsers);

module.exports = router;