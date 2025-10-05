# Full-Stack Real-Time Chat Application 🚀

A complete, production-ready real-time chat application similar to WhatsApp with both frontend and backend. The application uses Socket.IO for real-time communication and Firebase for the database.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

## 🌟 Key Features

### 🔐 User Authentication & Management
- 🔹 Email/password registration and login
- 🔹 Google OAuth sign-in option
- 🔹 User profile with avatar and status
- 🔹 Real-time online/offline status indicators
- 🔹 Last seen timestamp

### 💬 Real-Time Messaging
- 🔹 One-to-one private messaging
- 🔹 Instant message delivery via Socket.IO
- 🔹 Message delivery status (sent, delivered, read)
- 🔹 Real-time typing indicators
- 🔹 Message timestamps with relative time formatting
- 🔹 Persistent message history in Firestore

### 📱 WhatsApp-like Chat Interface
- **Left Sidebar**:
  - 🔍 Search bar for finding contacts
  - 📋 List of recent conversations
  - 👤 User profiles with avatars
  - 💬 Last message preview
  - 🔔 Unread message count badges
  - 🕒 Timestamp of last message

- **Main Chat Area**:
  - 💬 Message bubbles (sent messages on right, received on left)
  - 👤 User avatar and name at top
  - 🟢 Online status indicator
  - 📝 Message input box at bottom
  - 📤 Send button
  - 😊 Emoji picker
  - 📎 File/image attachment option

### 👥 User Management
- 🔍 Add contacts by email or username
- 🔎 Contact list with search functionality
- 📄 User profile page (editable)
- 🚫 Block/unblock users

### 🎯 Additional Features
- 🔔 Message notifications (browser notifications)
- 🔊 Sound alerts for new messages
- 🖼️ Image and file sharing
- 🗑️ Message deletion
- ✏️ Edit sent messages (within time limit)
- 😍 Message reactions (emoji reactions)
- 👥 Group chat creation (optional but preferred)

## 🛠️ Technical Stack

### ⚙️ Backend
- **Framework**: Node.js with Express.js
- **Real-time Communication**: Socket.IO
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **File Storage**: Firebase Storage
- **Additional Libraries**: 
  - cors for cross-origin requests
  - dotenv for environment variables
  - uuid for generating unique IDs
  - Winston for logging

### 🎨 Frontend
- **Framework**: React.js with TypeScript and functional components
- **Styling**: Tailwind CSS
- **Icons**: Heroicons v2
- **Real-time Client**: Socket.IO Client
- **State Management**: React Context API + Hooks
- **Firebase SDK**: Firebase JS SDK for authentication and Firestore
- **Build Tool**: Webpack (via Create React App)

### ☁️ Infrastructure
- **Cloud Platform**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: 
  - Backend: Node.js server (Heroku, AWS, Google Cloud)
  - Frontend: Static hosting (Netlify, Vercel, Firebase Hosting)

## 📁 Project Structure

```
.
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   ├── App.tsx
    │   └── index.tsx
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

### 📦 Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```env
   PORT=5000
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY_ID=your-private-key-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_CLIENT_ID=your-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Firebase configuration:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## 🔥 Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Firebase Authentication (Email/Password and Google)
4. Enable Firebase Storage
5. Generate a service account key file for the backend
6. Copy the configuration values to your `.env` files

## 🔄 Socket.IO Connection Handling

The application uses Socket.IO for real-time communication between clients and the server:

- **Connection**: Established automatically when the application starts
- **Reconnection**: Automatic with exponential backoff
- **Heartbeat**: Built-in ping/pong mechanism to detect disconnections
- **Rooms**: Conversation-based rooms for efficient message routing

## 🌍 Environment Variables

### Backend (.env)
```env
PORT=5000
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## ☁️ Deployment Instructions

### Backend Deployment
1. Choose a hosting platform (e.g., Heroku, AWS, Google Cloud)
2. Set up environment variables on the platform
3. Deploy the backend code
4. Update the `CLIENT_URL` in the backend `.env` to match your frontend deployment URL

### Frontend Deployment

#### Deploy to Netlify (Recommended)
1. Push your code to a GitHub repository
2. Sign up/in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Add environment variables in the Netlify UI:
   ```env
   REACT_APP_API_URL=http://your-backend-url.com
   REACT_APP_SOCKET_URL=http://your-backend-url.com
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```
7. Deploy the site

#### Deploy to Other Platforms
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the build folder to a static hosting service (e.g., Vercel, Firebase Hosting)

### 🔥 Important Deployment Notes

#### Environment Variables Setup
For your application to work properly in deployment, you MUST update your environment variables:

1. **For Local Development** (Keep your current .env file):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   ```

2. **For Production Deployment** (Set in Netlify dashboard):
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

**Important**: Replace `your-backend-url.com` with your actual deployed backend URL.

## ✅ Success Criteria

The application should:
- Allow users to register and login successfully ✅
- Display real-time messages without page refresh ✅
- Show online/offline status accurately ✅
- Handle multiple simultaneous users ✅
- Persist messages in Firebase ✅
- Work on both desktop and mobile browsers ✅
- Show typing indicators in real-time ✅
- Update message status (sent, delivered, read) ✅
- Handle reconnection gracefully ✅
- Be production-ready and scalable ✅

## 🤖 Troubleshoot Deployment Issues

If your deployed application isn't working properly, check these common issues:

### 1. ❌ Environment Variables Not Set
**Problem**: Application works locally but not when deployed
**Solution**: 
- Ensure all environment variables are set in your Netlify dashboard under 'Site settings > Build & deploy > Environment'
- Make sure `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` point to your deployed backend URL, not localhost

### 2. 🔌 CORS Issues
**Problem**: WebSocket connection fails or API calls are blocked
**Solution**:
- Ensure your backend CORS configuration allows your Netlify domain
- Update `CLIENT_URL` in your backend `.env` to match your Netlify site URL
- Check that your [netlify.toml](file:///C:/Users/rishu/OneDrive/Desktop/Chat-now/netlify.toml) file has the correct proxy settings for API and Socket.IO calls

### 3. 🔐 Firebase Security Rules
**Problem**: Firestore permission errors
**Solution**:
- Check that your Firestore security rules allow the necessary read/write operations
- Deploy updated rules with `firebase deploy --only firestore:rules`

### 4. 🌐 Network Configuration
**Problem**: Real-time features not working
**Solution**:
- Ensure your backend server is accessible from the internet
- Check that WebSocket connections are not being blocked by firewalls

### 5. 📁 Build Issues
**Problem**: White screen or blank page
**Solution**:
- Check Netlify build logs for errors
- Ensure all dependencies are correctly listed in package.json
- Verify that the build completes successfully

### 6. 📍 Routing Issues
**Problem**: Page refresh results in 404 errors
**Solution**:
- The `_redirects` file handles client-side routing for SPAs
- Ensure the `_redirects` file exists in the `public` folder with the correct format:
  ```
  /* /index.html 200
  ```
- This file is automatically copied to the build folder during deployment
- Without this file, Netlify will try to serve actual file paths instead of letting React Router handle routing
- For more details, see [ROUTING_EXPLAINED.md](ROUTING_EXPLAINED.md)
- For a complete checklist, see [ROUTING_CHECKLIST.md](ROUTING_CHECKLIST.md)

### 7. 🔧 Backend Deployment
**Problem**: API calls fail with 404 or connection errors
**Solution**:
- Your backend must be deployed separately (e.g., to Heroku, Render, or similar)
- Update the proxy settings in [netlify.toml](file:///C:/Users/rishu/OneDrive/Desktop/Chat-now/netlify.toml) with your actual backend URL

### Debugging Steps:
1. Check browser console for errors (F12 Developer Tools)
2. Verify all environment variables are correctly set in Netlify dashboard
3. Confirm backend server is running and accessible
4. Check Netlify deploy logs for build errors
5. Test API endpoints directly with tools like Postman
6. Verify that your [netlify.toml](file:///C:/Users/rishu/OneDrive/Desktop/Chat-now/netlify.toml) proxy settings point to your actual backend deployment

### Required Environment Variables:

**Frontend (Set in Netlify Dashboard)**:
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

**Backend (Set in your backend hosting platform)**:
```env
PORT=5000
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-client-cert-url
CLIENT_URL=https://your-frontend-netlify-url.netlify.app
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Firebase](https://firebase.google.com/) for backend services
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Heroicons](https://heroicons.com/) for icons