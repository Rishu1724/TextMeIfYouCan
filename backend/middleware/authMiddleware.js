const admin = require('firebase-admin');

const authenticate = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach the user to the request object
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.code === 'auth/argument-error') {
      res.status(401).json({ message: 'Invalid token format' });
    } else if (error.code === 'auth/id-token-expired') {
      res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
};

module.exports = { authenticate };