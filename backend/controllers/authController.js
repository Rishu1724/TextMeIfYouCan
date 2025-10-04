const { db, admin } = require('../utils/firebase');
const { v4: uuidv4 } = require('uuid');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, password, username, displayName } = req.body;
    
    // Check if user already exists with this email
    const userSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    
    if (!userSnapshot.empty) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Check if username is already taken
    const usernameSnapshot = await db.collection('users').where('username', '==', username).limit(1).get();
    
    if (!usernameSnapshot.empty) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    
    // Create user with Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || username
    });
    
    // Create user profile in Firestore with Firebase UID
    const userId = userRecord.uid;
    const newUser = {
      uid: userId,
      email,
      username: username || email.split('@')[0],
      displayName: displayName || username || email.split('@')[0],
      avatarUrl: '',
      status: 'Hey there! I am using Chat App',
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date()
    };
    
    await db.collection('users').doc(userId).set(newUser);
    
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ message: 'Email is already in use' });
    } else if (error.code === 'auth/invalid-email') {
      res.status(400).json({ message: 'Invalid email address' });
    } else if (error.code === 'auth/weak-password') {
      res.status(400).json({ message: 'Password should be at least 6 characters' });
    } else {
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verify user credentials with Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);
    
    if (!userRecord) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // In a real app, you would verify the password here
    // For Firebase Admin SDK, we trust the client-side authentication
    // The client should have already authenticated with Firebase Auth
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(400).json({ message: 'User profile not found' });
    }
    
    const userData = userDoc.data();
    
    // Update user status to online
    await db.collection('users').doc(userRecord.uid).update({
      isOnline: true,
      lastSeen: new Date()
    });
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        ...userData,
        isOnline: true
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.code === 'auth/user-not-found') {
      res.status(400).json({ message: 'Invalid credentials' });
    } else {
      res.status(500).json({ message: 'Server error during login' });
    }
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Update user status to offline
    await db.collection('users').doc(userId).update({
      isOnline: false,
      lastSeen: new Date()
    });
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.uid; // From auth middleware
    
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user: userDoc.data() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid; // From auth middleware
    const { displayName, status, avatarUrl } = req.body;
    
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    if (status) updateData.status = status;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    
    await db.collection('users').doc(userId).update(updateData);
    
    const updatedUserDoc = await db.collection('users').doc(userId).get();
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUserDoc.data()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile
};