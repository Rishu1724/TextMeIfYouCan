# Project Structure

## Backend

```
backend/
├── controllers/
│   ├── authController.js
│   ├── conversationController.js
│   ├── messageController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── conversationRoutes.js
│   ├── messageRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── firebase.js
│   └── logger.js
├── server.js
├── package.json
└── .env
```

## Frontend

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── SocketContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useSocket.ts
│   │   └── useSocketContext.ts
│   ├── pages/
│   │   ├── ChatPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── services/
│   │   └── chatService.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── firebase.ts
│   └── ...
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── .env
```

## Key Files

### Backend
- `server.js`: Main server file with Express app and Socket.IO configuration
- `controllers/*.js`: Business logic for different entities
- `routes/*.js`: API route definitions
- `middleware/authMiddleware.js`: Authentication middleware
- `utils/firebase.js`: Firebase initialization
- `utils/logger.js`: Logging utility

### Frontend
- `src/App.tsx`: Main application component with routing
- `src/pages/*.tsx`: Page components (Login, Register, Chat)
- `src/contexts/*.tsx`: React context providers (Auth, Socket)
- `src/hooks/*.ts`: Custom React hooks
- `src/services/chatService.ts`: Service layer for chat functionality
- `src/firebase.ts`: Firebase SDK initialization