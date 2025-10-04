# API Documentation

## Authentication

### Register a new user
**POST** `/api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username",
  "displayName": "Display Name"
}
```

### Login user
**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Logout user
**POST** `/api/auth/logout`
```json
{
  "userId": "user-id"
}
```

### Get user profile
**GET** `/api/auth/profile`

### Update user profile
**PUT** `/api/auth/profile`
```json
{
  "displayName": "New Name",
  "status": "New status message",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

## Users

### Get all users/contacts
**GET** `/api/users`

### Get specific user
**GET** `/api/users/:userId`

### Search users
**POST** `/api/users/search`
```json
{
  "query": "search-term"
}
```

## Conversations

### Get user's conversations
**GET** `/api/conversations`

### Get specific conversation
**GET** `/api/conversations/:id`

### Create new conversation
**POST** `/api/conversations`
```json
{
  "participants": ["user1-id", "user2-id"],
  "type": "private"
}
```

### Delete conversation
**DELETE** `/api/conversations/:id`

## Messages

### Get messages for conversation
**GET** `/api/messages/:conversationId`

### Send message
**POST** `/api/messages`
```json
{
  "conversationId": "conversation-id",
  "text": "Message text",
  "type": "text"
}
```

### Edit message
**PUT** `/api/messages/:messageId`
```json
{
  "text": "Updated message text"
}
```

### Delete message
**DELETE** `/api/messages/:messageId`

### Mark message as read
**PUT** `/api/messages/:messageId/read`

## Socket.IO Events

### Client to Server
- `join` - Join a conversation room
- `leave` - Leave a conversation room
- `sendMessage` - Send a new message
- `typing` - User is typing
- `stopTyping` - User stopped typing
- `messageRead` - Mark message as read
- `userOnline` - User comes online
- `userOffline` - User goes offline
- `deleteMessage` - Delete a message
- `editMessage` - Edit a message

### Server to Client
- `receiveMessage` - Receive new message
- `messageDelivered` - Message delivery confirmation
- `messageRead` - Message read confirmation
- `userTyping` - Someone is typing
- `userStoppedTyping` - Someone stopped typing
- `userStatusChange` - User online/offline status changed
- `messageDeleted` - Message was deleted
- `messageEdited` - Message was edited