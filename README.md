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