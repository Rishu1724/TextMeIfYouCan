const admin = require('firebase-admin');
const path = require('path');

// Only initialize if not already initialized
if (!admin.apps.length) {
  try {
    // Try to initialize with service account key file
    const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    
    // Check if service account key file exists
    const fs = require('fs');
    if (fs.existsSync(serviceAccountPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      console.log('Firebase initialized with service account key file');
    } else {
      // Fallback to environment variables
      const serviceAccount = {
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

      // Check if we have valid service account credentials
      if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase initialized with environment variables');
      } else {
        // Initialize with default credentials (for development)
        admin.initializeApp();
        console.warn('Firebase not configured with service account. Using default credentials.');
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    // Initialize with default credentials as fallback
    try {
      admin.initializeApp();
      console.warn('Firebase initialized with default credentials due to error.');
    } catch (fallbackError) {
      console.error('Failed to initialize Firebase with default credentials:', fallbackError);
    }
  }
}

const db = admin.firestore();

module.exports = { admin, db };