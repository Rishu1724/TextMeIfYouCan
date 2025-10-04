const { db } = require('../utils/firebase');
const { v4: uuidv4 } = require('uuid');

// Get user's conversations
const getConversations = async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Get conversations where user is a participant
    const conversationsSnapshot = await db.collection('conversations')
      .where('participants', 'array-contains', userId)
      .orderBy('lastMessageTime', 'desc')
      .get();
    
    const conversations = [];
    conversationsSnapshot.forEach(doc => {
      conversations.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error fetching conversations' });
  }
};

// Get specific conversation
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const conversationDoc = await db.collection('conversations').doc(id).get();
    
    if (!conversationDoc.exists) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const conversation = { id: conversationDoc.id, ...conversationDoc.data() };
    
    // Check if user is a participant
    if (!conversation.participants.includes(req.user.uid)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error fetching conversation' });
  }
};

// Create new conversation
const createConversation = async (req, res) => {
  try {
    const { participants, type = 'private' } = req.body;
    const currentUserId = req.user.uid;
    
    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ message: 'Participants are required' });
    }
    
    // Check if conversation already exists for private chats
    if (type === 'private' && participants.length === 2) {
      const existingConversationSnapshot = await db.collection('conversations')
        .where('type', '==', 'private')
        .where('participants', 'array-contains', participants[0])
        .get();
      
      for (const doc of existingConversationSnapshot.docs) {
        const convData = doc.data();
        if (convData.participants.includes(participants[1])) {
          return res.status(200).json({ 
            message: 'Conversation already exists', 
            conversation: { id: doc.id, ...convData } 
          });
        }
      }
    }
    
    // Get participant details
    const participantDetails = {};
    for (const userId of participants) {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        participantDetails[userId] = {
          name: userData.displayName || userData.username,
          avatar: userData.avatarUrl || ''
        };
      }
    }
    
    // Create new conversation
    const conversationId = uuidv4();
    const newConversation = {
      conversationId,
      participants,
      participantDetails,
      lastMessage: '',
      lastMessageTime: new Date(),
      createdAt: new Date(),
      type
    };
    
    await db.collection('conversations').doc(conversationId).set(newConversation);
    
    res.status(201).json({
      message: 'Conversation created successfully',
      conversation: { id: conversationId, ...newConversation }
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Server error creating conversation' });
  }
};

// Delete conversation
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    
    const conversationDoc = await db.collection('conversations').doc(id).get();
    
    if (!conversationDoc.exists) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const conversation = conversationDoc.data();
    
    // Check if user is a participant
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete conversation
    await db.collection('conversations').doc(id).delete();
    
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Server error deleting conversation' });
  }
};

module.exports = {
  getConversations,
  getConversationById,
  createConversation,
  deleteConversation
};