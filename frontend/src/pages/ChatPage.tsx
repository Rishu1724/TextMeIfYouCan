import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocketContext } from '../hooks/useSocketContext';
import { getUserConversations, getConversationMessages, sendMessage, markMessageAsRead, sendTypingIndicator, stopTypingIndicator, sendFileMessage, searchUsers, createConversation, getUserById, User } from '../services/chatService';
import { PaperClipIcon, CameraIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Define types for our data
interface ParticipantDetails {
  [key: string]: {
    name: string;
    avatar: string;
    isOnline?: boolean;
  };
}

interface Conversation {
  id: string;
  participants: string[];
  participantDetails: ParticipantDetails;
  lastMessage: string;
  lastMessageTime: Date;
  type: string;
}

interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  status: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
}

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useAuth();
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      // Fetch user's conversations
      const unsubscribe = getUserConversations(currentUser.uid, (convs) => {
        setConversations(convs);
      });

      // Emit user online status
      if (socket) {
        socket.emit('userOnline', currentUser.uid);
      }

      return () => {
        unsubscribe();
        // Emit user offline status
        if (socket) {
          socket.emit('userOffline', currentUser.uid);
        }
      };
    }
  }, [currentUser, navigate, socket]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      // Join conversation room when active conversation changes
      if (activeConversation) {
        socket.emit('join', activeConversation.id);
      }

      // Listen for new messages
      socket.on('receiveMessage', (message: Message) => {
        if (message.conversationId === activeConversation?.id) {
          setMessages(prev => [...prev, message]);
          
          // Mark message as delivered
          socket.emit('messageDelivered', { messageId: message.id, conversationId: message.conversationId });
          
          // Show notification if the window is not focused
          if (!document.hasFocus() && message.senderId !== currentUser?.uid) {
            showNotification(message.senderName, message.text);
          }
        } else {
          // Show notification for messages in other conversations
          if (message.senderId !== currentUser?.uid) {
            showNotification(message.senderName, message.text);
          }
        }
      });

      // Listen for message delivery confirmation
      socket.on('messageDelivered', (data: any) => {
        // Update message status to delivered
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, status: 'delivered' } : msg
        ));
      });

      // Listen for message read confirmation
      socket.on('messageRead', (data: any) => {
        // Update message status to read
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, status: 'read' } : msg
        ));
      });

      // Listen for typing indicators
      socket.on('userTyping', (data: any) => {
        setTypingUsers(prev => {
          if (!prev.includes(data.userId)) {
            return [...prev, data.userId];
          }
          return prev;
        });
        
        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }, 3000);
      });

      // Listen for stop typing indicators
      socket.on('userStoppedTyping', (data: any) => {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      });

      // Listen for user status changes
      socket.on('userStatusChange', (data: any) => {
        // Update conversations with user status
        setConversations(prev => prev.map(conv => {
          // Check if this conversation has the user whose status changed
          if (conv.participants.includes(data.userId)) {
            // Update the participant details with online status
            return {
              ...conv,
              participantDetails: {
                ...conv.participantDetails,
                [data.userId]: {
                  ...conv.participantDetails[data.userId],
                  isOnline: data.isOnline
                }
              }
            };
          }
          return conv;
        }));
      });

      // Listen for message deletion
      socket.on('messageDeleted', (data: any) => {
        // Handle message deletion
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, isDeleted: true, text: 'This message was deleted' } : msg
        ));
      });

      // Listen for message editing
      socket.on('messageEdited', (data: any) => {
        // Handle message editing
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, text: data.text, isEdited: true } : msg
        ));
      });

      // Clean up listeners
      return () => {
        socket.off('receiveMessage');
        socket.off('messageDelivered');
        socket.off('messageRead');
        socket.off('userTyping');
        socket.off('userStoppedTyping');
        socket.off('userStatusChange');
        socket.off('messageDeleted');
        socket.off('messageEdited');
        
        // Leave conversation room
        if (activeConversation) {
          socket.emit('leave', activeConversation.id);
        }
      };
    }
  }, [socket, activeConversation, currentUser]);

  useEffect(() => {
    if (activeConversation) {
      // Fetch messages for the active conversation
      const unsubscribe = getConversationMessages(activeConversation.id, (msgs) => {
        setMessages(msgs);
        
        // Mark unread messages as read
        msgs.forEach(msg => {
          // Only mark messages as read if:
          // 1. The message has an ID
          // 2. The message was sent by someone else (not the current user)
          // 3. The message is not already marked as read
          // 4. The message is not deleted
          if (msg.id && 
              msg.senderId !== currentUser?.uid && 
              msg.status !== 'read' && 
              !msg.isDeleted) {
            // Add a small delay to avoid flooding the server with requests
            setTimeout(() => {
              markMessageAsRead(msg.id!);
              if (socket) {
                socket.emit('messageRead', { 
                  messageId: msg.id, 
                  conversationId: activeConversation.id 
                });
              }
            }, 100);
          }
        });
      });

      return () => unsubscribe();
    }
  }, [activeConversation, currentUser, socket]);

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
      
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Sound play failed:', e));
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && socket && activeConversation && currentUser) {
      const messageData = {
        conversationId: activeConversation.id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        text: newMessage,
        timestamp: new Date()
      };

      try {
        // Send message to backend
        await sendMessage(messageData);
        
        // Send message through socket
        socket.emit('sendMessage', { ...messageData, timestamp: new Date() });
        
        // Stop typing indicator
        stopTypingIndicator(socket, activeConversation.id, currentUser.uid);
        
        // Clear input
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && activeConversation) {
      const file = files[0];
      const isImage = file.type.startsWith('image/');
      
      try {
        // Send file message to backend
        await sendFileMessage(activeConversation.id, file, isImage ? 'image' : 'file');
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleTyping = () => {
    if (socket && activeConversation && currentUser) {
      // Send typing indicator
      sendTypingIndicator(socket, activeConversation.id, currentUser.uid);
      
      // Set timeout to stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        stopTypingIndicator(socket, activeConversation.id, currentUser.uid);
      }, 1000);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const results = await searchUsers(query);
        setSearchResults(results.filter(user => user.uid !== currentUser?.uid));
        setShowSearchResults(true);
        setError(null);
      } catch (error: any) {
        console.error('Error searching users:', error);
        setSearchResults([]);
        setError(error.message || 'Failed to search users');
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setError(null);
    }
  };

  const handleUserSelect = async (user: User) => {
    // Check if conversation already exists with this user
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(user.uid)
    );
    
    if (existingConversation) {
      setActiveConversation(existingConversation);
    } else {
      // Create new conversation
      try {
        const conversationId = await createConversation([currentUser!.uid, user.uid]);
        
        // Get user details for the new conversation
        const currentUserData = await getUserById(currentUser!.uid);
        const otherUserData = await getUserById(user.uid);
        
        const newConversation: Conversation = {
          id: conversationId,
          participants: [currentUser!.uid, user.uid],
          participantDetails: {
            [currentUser!.uid]: {
              name: currentUserData?.displayName || currentUserData?.username || 'You',
              avatar: currentUserData?.avatarUrl || ''
            },
            [user.uid]: {
              name: user.displayName || user.username,
              avatar: user.avatarUrl || '',
              isOnline: user.isOnline || false
            }
          },
          lastMessage: '',
          lastMessageTime: new Date(),
          type: 'private'
        };
        
        // Add to conversations list
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversation(newConversation);
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }
    
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    // Handle logout
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden p-4 bg-white border-b border-gray-300 flex justify-between items-center">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          {sidebarOpen ? 'Hide Conversations' : 'Show Conversations'}
        </button>
        <button 
          onClick={handleLogout}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-1/3 bg-white border-r border-gray-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-300">
          {/* User Profile Section */}
          {currentUser && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white font-bold">
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">
                    {currentUser.displayName || currentUser.email}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    UID: {currentUser.uid}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Chat App</h1>
            <button 
              onClick={handleLogout}
              className="hidden md:block text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by username or UID..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-l"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery);
                    }
                  }}
                />
              </div>
              <button
                onClick={() => handleSearch(searchQuery)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r whitespace-nowrap"
              >
                Search
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map(user => (
                  <div 
                    key={user.uid}
                    onClick={() => handleUserSelect(user)}
                    className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                      <span className="text-gray-700 font-bold">
                        {user.displayName?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {user.displayName || user.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.username}
                      </div>
                      <div className="text-xs text-gray-400">
                        UID: {user.uid}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => {
                setActiveConversation(conversation);
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3 relative">
                  <span className="text-gray-700 font-bold">
                    {conversation.participantDetails[conversation.participants[1]]?.name?.charAt(0) || 'U'}
                  </span>
                  {/* Online status indicator */}
                  {conversation.participantDetails[conversation.participants[1]]?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h2 className="font-bold truncate">
                      {conversation.participantDetails[conversation.participants[1]]?.name || 'Unknown User'}
                    </h2>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-300">
              <div className="flex items-center">
                <div className="md:hidden mr-3">
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Back
                  </button>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  <span className="text-gray-700 font-bold">
                    {activeConversation.participantDetails[activeConversation.participants[1]]?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="font-bold">
                    {activeConversation.participantDetails[activeConversation.participants[1]]?.name || 'Unknown User'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    @{activeConversation.participantDetails[activeConversation.participants[1]]?.name || 'username'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => {
                // Create a more robust key that handles various data types
                let key = '';
                try {
                  let timestampValue: number;
                  
                  if (message.timestamp instanceof Date) {
                    timestampValue = message.timestamp.getTime();
                  } else if (typeof message.timestamp === 'object' && message.timestamp !== null && 'seconds' in message.timestamp) {
                    // Firestore timestamp
                    timestampValue = (message.timestamp as any).seconds * 1000;
                  } else if (typeof message.timestamp === 'string') {
                    timestampValue = new Date(message.timestamp).getTime();
                  } else {
                    // Fallback to current time
                    timestampValue = Date.now();
                  }
                  
                  key = `${message.id || 'no-id'}-${timestampValue}-${index}-${message.senderId || 'no-sender'}-${message.text?.substring(0, 20) || 'no-text'}`;
                } catch (e) {
                  // Fallback key generation if there are any errors
                  key = `msg-${index}-${Math.random()}`;
                }
                
                return (
                  <div 
                    key={key}
                    className={`flex mb-4 ${
                      message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === currentUser?.uid
                          ? 'bg-green-100 text-gray-800 rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {message.type === 'image' && message.fileUrl ? (
                        <div>
                          <img src={message.fileUrl} alt="Uploaded" className="max-w-full h-auto rounded" />
                          <p className="mt-1">{message.text}</p>
                        </div>
                      ) : message.type === 'file' && message.fileUrl ? (
                        <div className="flex items-center">
                          <PaperClipIcon className="h-5 w-5 text-gray-500 mr-2" />
                          <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {message.text}
                          </a>
                        </div>
                      ) : (
                        <p>{message.text}</p>
                      )}
                      <div className="flex justify-end items-center mt-1">
                        <span className="text-xs text-gray-500 mr-1">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.senderId === currentUser?.uid && (
                          <span className="text-xs text-gray-500">
                            {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓' : 'Sending...'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="px-4 py-2 bg-gray-50">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-2 text-sm text-gray-500">typing...</span>
                </div>
              </div>
            )}
            
            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-300">
              <div className="flex items-center mb-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <CameraIcon className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    } else {
                      handleTyping();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-500 mb-4">Select a conversation</h2>
              <p className="text-gray-400">Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;


























































