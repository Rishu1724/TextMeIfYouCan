# 🚀 Deployment Guide

This guide will help you deploy the Chat Application to production. The application consists of two parts:
1. **Frontend** - React application (to be deployed on Netlify)
2. **Backend** - Node.js server (to be deployed on a platform like Heroku, Render, or similar)

## 📋 Prerequisites

Before deploying, ensure you have:
1. A Firebase project with Firestore, Authentication, and Storage enabled
2. Firebase service account credentials
3. A GitHub account
4. Accounts on your chosen deployment platforms (Netlify for frontend, Heroku/Render for backend)

## 🔧 Step 1: Deploy the Backend

### Option A: Deploy to Heroku (Recommended)

1. Create a new app on Heroku
2. Connect your GitHub repository to Heroku
3. Set the following environment variables in Heroku dashboard under "Settings > Config Vars":

```env
PORT=5000
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
CLIENT_URL=https://your-frontend-url.netlify.app
NODE_ENV=production
```

4. Enable automatic deploys from GitHub
5. Deploy the app

### Option B: Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:

```env
PORT=5000
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
CLIENT_URL=https://your-frontend-url.netlify.app
NODE_ENV=production
```

4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Deploy the app

## 🌐 Step 2: Update Netlify Configuration

Before deploying the frontend, update the proxy settings in the root [netlify.toml](file:///C:/Users/rishu/OneDrive/Desktop/Chat-now/netlify.toml) file:

```toml
[build]
  command = "echo 'No build command needed for root'"
  publish = "."

# Replace 'https://your-backend-deployment-url.com' with your actual backend URL
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-deployment-url.com/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/socket.io/*"
  to = "https://your-backend-deployment-url.com/socket.io/:splat"
  status = 200
  force = true
```

## 🎨 Step 3: Deploy the Frontend to Netlify

1. Push your updated code to GitHub
2. Create a new site on Netlify
3. Connect your GitHub repository
4. Set the following build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Set the following environment variables in Netlify dashboard under "Site settings > Build & deploy > Environment":

```env
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_SOCKET_URL=https://your-backend-url.com
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

6. Deploy the site

## 🔍 Step 4: Verify Deployment

After deployment, check:

1. **Frontend URL**: Your Netlify site should load without errors
2. **Backend Health Check**: Visit `https://your-backend-url.com/health` - you should see a JSON response
3. **API Endpoints**: Test a few API endpoints to ensure they're working
4. **WebSocket Connection**: Check browser console for Socket.IO connection success
5. **Firebase Integration**: Ensure authentication and Firestore operations work

## 🛠️ Common Issues and Solutions

### 1. ❌ Environment Variables Not Set
**Symptoms**: White screen, authentication failures, API errors
**Solution**: Double-check all environment variables in both Netlify and backend dashboards

### 2. 🔌 CORS Errors
**Symptoms**: API calls failing with CORS errors
**Solution**: 
- Ensure `CLIENT_URL` in backend matches your Netlify site URL
- Check that proxy settings in [netlify.toml](file:///C:/Users/rishu/OneDrive/Desktop/Chat-now/netlify.toml) point to your actual backend URL

### 3. 🔐 Firebase Permission Errors
**Symptoms**: Firestore read/write operations failing
**Solution**: 
- Deploy updated Firestore security rules
- Verify service account credentials are correct

### 4. 🌐 WebSocket Connection Failures
**Symptoms**: Real-time features not working
**Solution**:
- Check that your backend URL supports WebSocket connections
- Ensure proxy settings are correctly configured

## 📊 Monitoring and Maintenance

1. Regularly check deployment logs on both platforms
2. Monitor Firebase usage and adjust security rules as needed
3. Keep dependencies updated
4. Set up monitoring for uptime and performance

## 🆘 Need Help?

If you're still experiencing issues:

1. Check browser console for specific error messages
2. Check deployment logs on Netlify and your backend platform
3. Verify all environment variables are correctly set
4. Ensure your backend is accessible from the internet
5. Test API endpoints directly with tools like Postman

For additional support, refer to the [README.md](file:///C:/Users/rishu/OneDrive/Desktop/Chat-now/README.md) file or open an issue on the repository.