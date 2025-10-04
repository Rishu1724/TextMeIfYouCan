import React, { createContext, useState, useEffect, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

// Define the shape of our context
interface SocketContextType {
  socket: Socket | null;
}

// Create the context with a default value
const SocketContext = createContext<SocketContextType>({
  socket: null,
});

// Create a provider component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection with better options
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      withCredentials: true,
      autoConnect: true,
      upgrade: true,
      rememberUpgrade: false,
      rejectUnauthorized: false,
      path: '/socket.io/',
      forceNew: true,
      secure: false
    });
    setSocket(newSocket);

    // Handle connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      // Attempt to reconnect manually if automatic reconnection fails
      if (reason === 'io server disconnect') {
        // Server intentionally closed the connection, attempt to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Try to reconnect on connection error
      setTimeout(() => {
        newSocket.connect();
      }, 1000);
    });

    newSocket.on('reconnect', (attempt) => {
      console.log('Socket reconnected after', attempt, 'attempts');
    });

    newSocket.on('reconnect_attempt', (attempt) => {
      console.log('Socket reconnect attempt:', attempt);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Socket reconnect failed');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Clean up on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;