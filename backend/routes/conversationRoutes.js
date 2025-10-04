const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { 
  getConversations, 
  getConversationById, 
  createConversation, 
  deleteConversation 
} = require('../controllers/conversationController');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get user's conversations
router.get('/', getConversations);

// Get specific conversation
router.get('/:id', getConversationById);

// Create new conversation
router.post('/', createConversation);

// Delete conversation
router.delete('/:id', deleteConversation);

module.exports = router;