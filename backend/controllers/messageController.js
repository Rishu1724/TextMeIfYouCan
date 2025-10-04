const { db } = require('../utils/firebase');
const { v4: uuidv4 } = require('uuid');

// Get messages for conversation
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, before = null } = req.query;
    
    // Check if conversation exists and user is a participant
    const conversationDoc = await db.collection('conversations').doc(conversationId).get();
    
    if (!conversationDoc.exists) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const conversation = conversationDoc.data();
    if (!conversation.participants.includes(req.user.uid)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get messages for conversation
    let query = db.collection('messages')
      .where('conversationId', '==', conversationId)
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit));
    
    if (before) {
      const beforeDoc = await db.collection('messages').doc(before).get();
      if (beforeDoc.exists) {
        query = query.startAfter(beforeDoc);
      }
    }
    
    const messagesSnapshot = await query.get();
    const messages = [];
    
    messagesSnapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    // Reverse to show oldest first
    messages.reverse();
    
    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, text, type = 'text', fileUrl = null } = req.body;
    const senderId = req.user.uid;
    
    // Check if conversation exists and user is a participant
    const conversationDoc = await db.collection('conversations').doc(conversationId).get();
    
    if (!conversationDoc.exists) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const conversation = conversationDoc.data();
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get sender details
    const senderDoc = await db.collection('users').doc(senderId).get();
    const senderData = senderDoc.data();
    
    // Create new message
    const messageId = uuidv4();
    const newMessage = {
      messageId,
      conversationId,
      senderId,
      senderName: senderData.displayName || senderData.username,
      text,
      timestamp: new Date(),
      status: 'sent',
      type,
      fileUrl: type !== 'text' ? fileUrl : null,
      isEdited: false,
      isDeleted: false
    };
    
    await db.collection('messages').doc(messageId).set(newMessage);
    
    // Update conversation's last message
    await db.collection('conversations').doc(conversationId).update({
      lastMessage: text,
      lastMessageTime: new Date()
    });
    
    res.status(201).json({
      message: 'Message sent successfully',
      messageData: newMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

// Edit message
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user.uid;
    
    // Get message
    const messageDoc = await db.collection('messages').doc(messageId).get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const message = messageDoc.data();
    
    // Check if user is the sender
    if (message.senderId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update message
    await db.collection('messages').doc(messageId).update({
      text,
      isEdited: true,
      editedAt: new Date()
    });
    
    const updatedMessageDoc = await db.collection('messages').doc(messageId).get();
    
    res.status(200).json({
      message: 'Message updated successfully',
      messageData: { id: updatedMessageDoc.id, ...updatedMessageDoc.data() }
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Server error editing message' });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.uid;
    
    // Get message
    const messageDoc = await db.collection('messages').doc(messageId).get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const message = messageDoc.data();
    
    // Check if user is the sender
    if (message.senderId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update message as deleted (soft delete)
    await db.collection('messages').doc(messageId).update({
      isDeleted: true,
      deletedAt: new Date(),
      text: 'This message was deleted'
    });
    
    const updatedMessageDoc = await db.collection('messages').doc(messageId).get();
    
    res.status(200).json({
      message: 'Message deleted successfully',
      messageData: { id: updatedMessageDoc.id, ...updatedMessageDoc.data() }
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error deleting message' });
  }
};

// Mark message as read
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.uid;
    
    // Get message
    const messageDoc = await db.collection('messages').doc(messageId).get();
    
    if (!messageDoc.exists) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const message = messageDoc.data();
    
    // Check if user is the recipient (not the sender)
    if (message.senderId === userId) {
      return res.status(400).json({ message: 'Cannot mark own message as read' });
    }
    
    // Update message status
    await db.collection('messages').doc(messageId).update({
      status: 'read',
      readAt: new Date()
    });
    
    const updatedMessageDoc = await db.collection('messages').doc(messageId).get();
    
    res.status(200).json({
      message: 'Message marked as read',
      messageData: { id: updatedMessageDoc.id, ...updatedMessageDoc.data() }
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Server error marking message as read' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markMessageAsRead
};
