const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { 
  getMessages, 
  sendMessage, 
  editMessage, 
  deleteMessage, 
  markMessageAsRead 
} = require('../controllers/messageController');

// Apply authentication middleware to all routes
router.use(authenticate);

// Get messages for conversation
router.get('/:conversationId', getMessages);

// Send message
router.post('/', sendMessage);

// Edit message
router.put('/:messageId', editMessage);

// Delete message
router.delete('/:messageId', deleteMessage);

// Mark message as read
router.put('/:messageId/read', markMessageAsRead);

module.exports = router;