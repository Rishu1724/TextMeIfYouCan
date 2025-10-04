const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { error, info } = require('./utils/logger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Socket.IO with better CORS configuration
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  cookie: false,
  path: '/socket.io/',
  serveClient: false,
  allowRequest: (req, callback) => {
    callback(null, true);
  }
});

// Add error handling for the Socket.IO server
io.engine.on('connection_error', (err) => {
  console.error('Socket.IO connection error:', err);
});

io.engine.on('error', (err) => {
  console.error('Socket.IO engine error:', err);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  info(`User connected: ${socket.id}`);

  // Handle errors for individual sockets
  socket.on('error', (err) => {
    error(`Socket error for ${socket.id}:`, err);
  });

  // Join a conversation room
  socket.on('join', (conversationId) => {
    socket.join(conversationId);
    info(`User ${socket.id} joined room ${conversationId}`);
  });

  // Leave a conversation room
  socket.on('leave', (conversationId) => {
    socket.leave(conversationId);
    info(`User ${socket.id} left room ${conversationId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', (messageData) => {
    // Emit to all users in the conversation room except sender
    socket.to(messageData.conversationId).emit('receiveMessage', messageData);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('userTyping', data);
  });

  socket.on('stopTyping', (data) => {
    socket.to(data.conversationId).emit('userStoppedTyping', data);
  });

  // Handle user online/offline status
  socket.on('userOnline', (userId) => {
    socket.broadcast.emit('userStatusChange', { userId, isOnline: true });
  });

  socket.on('userOffline', (userId) => {
    socket.broadcast.emit('userStatusChange', { userId, isOnline: false });
  });

  // Handle message read status
  socket.on('messageRead', (data) => {
    socket.to(data.conversationId).emit('messageRead', data);
  });

  // Handle message deletion
  socket.on('deleteMessage', (data) => {
    socket.to(data.conversationId).emit('messageDeleted', data);
  });

  // Handle message editing
  socket.on('editMessage', (data) => {
    socket.to(data.conversationId).emit('messageEdited', data);
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    info(`User disconnected: ${socket.id}, reason: ${reason}`);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.send('Chat App Backend Server is running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  info(`Server is running on port ${PORT}`);
});