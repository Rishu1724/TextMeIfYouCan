const { db } = require('../utils/firebase');

// Get all users/contacts
const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// Get specific user
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user: { id: userDoc.id, ...userDoc.data() } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query } = req.body;
    
    let users = [];
    
    // First, try to find user by UID if query looks like a UID
    if (query && query.length > 10) { // UID-like length check
      const userDoc = await db.collection('users').doc(query).get();
      if (userDoc.exists) {
        users.push({ id: userDoc.id, ...userDoc.data() });
        return res.status(200).json({ users });
      }
    }
    
    // Search by username
    const usernameQuery = await db.collection('users')
      .where('username', '>=', query)
      .where('username', '<=', query + '\uf8ff')
      .get();
    
    usernameQuery.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error searching users' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  searchUsers
};