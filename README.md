# Full-Stack Real-Time Chat Application

A complete, production-ready real-time chat application similar to WhatsApp with both frontend and backend. The application uses Socket.IO for real-time communication and Firebase for the database.

## Features

### User Authentication
- Email/password registration and login
- Google OAuth sign-in option
- User profile with avatar and status
- Online/offline status indicators
- Last seen timestamp

### Real-Time Messaging
- One-to-one private messaging
- Send and receive messages instantly via Socket.IO
- Message delivery status (sent, delivered, read)
- Typing indicators
- Message timestamps
- Message history persistence in Firestore

### Chat Interface (WhatsApp-like)
- **Left Sidebar**:
  - Search bar for finding contacts
  - List of recent conversations
  - User profiles with avatars
  - Last message preview
  - Unread message count badges
  - Timestamp of last message

- **Main Chat Area**:
  - Message bubbles (sent messages on right, received on left)
  - User avatar and name at top
  - Online status indicator
  - Message input box at bottom
  - Send button
  - Emoji picker
  - File/image attachment option

### User Management
- Add contacts by email or username
- Contact list with search functionality
- User profile page (editable)
- Block/unblock users

### Additional Features
- Message notifications (browser notifications)
- Sound alerts for new messages
- Image and file sharing
- Message deletion
- Edit sent messages (within time limit)
- Message reactions (emoji reactions)
- Group chat creation (optional but preferred)

## Technical Stack

### Backend
- **Framework**: Node.js with Express.js
- **Real-time Communication**: Socket.IO
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Additional Libraries**: 
  - cors for cross-origin requests
  - dotenv for environment variables
  - uuid for generating unique IDs

### Frontend
- **Framework**: React.js with functional components and hooks
- **Styling**: Tailwind CSS
- **Real-time Client**: Socket.IO Client
- **State Management**: React Context API
- **Firebase SDK**: Firebase JS SDK for authentication and Firestore

## Project Structure

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

## Setup Instructions

### Backend Setup

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

### Frontend Setup

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

## Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Firebase Authentication (Email/Password and Google)
4. Enable Firebase Storage
5. Copy the configuration values to your `.env` files

## Socket.IO Connection Handling

The application uses Socket.IO for real-time communication between clients and the server. The connection is established when the application starts and is maintained throughout the session.

## Environment Variables

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

## Deployment Instructions

### Backend Deployment
1. Choose a hosting platform (e.g., Heroku, AWS, Google Cloud)
2. Set up environment variables on the platform
3. Deploy the backend code
4. Update the `CLIENT_URL` in the backend `.env` to match your frontend deployment URL

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the build folder to a static hosting service (e.g., Netlify, Vercel, Firebase Hosting)

## Success Criteria

The application should:
- Allow users to register and login successfully
- Display real-time messages without page refresh
- Show online/offline status accurately
- Handle multiple simultaneous users
- Persist messages in Firebase
- Work on both desktop and mobile browsers
- Show typing indicators in real-time
- Update message status (sent, delivered, read)
- Handle reconnection gracefully
- Be production-ready and scalable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.