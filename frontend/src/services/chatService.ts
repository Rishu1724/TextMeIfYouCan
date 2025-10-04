import { db, auth, storage } from '../firebase';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot, updateDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Socket } from 'socket.io-client';

// Define types for our data
export interface User {
  uid: string;
  displayName: string;
  email: string;
  username: string;
  avatarUrl?: string;
  status?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

interface Conversation {
  id: string;
  participants: string[];
  participantDetails: {
    [key: string]: {
      name: string;
      avatar: string;
      isOnline?: boolean;
    };
  };
  lastMessage: string;
  lastMessageTime: Date;
  type: 'private' | 'group';
}

interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
}

// Create a new user profile in Firestore
export const createUserProfile = async (userData: Omit<User, 'uid'> & { uid: string }) => {
  try {
    await setDoc(doc(db, 'users', userData.uid), userData);
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Create a new conversation
export const createConversation = async (participants: string[], type: 'private' | 'group' = 'private') => {
  try {
    const conversationRef = await addDoc(collection(db, 'conversations'), {
      participants,
      participantDetails: {},
      lastMessage: '',
      lastMessageTime: new Date(),
      createdAt: new Date(),
      type
    });
    
    return conversationRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// Get user's conversations
export const getUserConversations = (userId: string, callback: (conversations: Conversation[]) => void) => {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', userId)
    // Removed orderBy to avoid the need for a composite index
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const conversations: Conversation[] = [];
    querySnapshot.forEach((doc) => {
      conversations.push({ id: doc.id, ...doc.data() } as Conversation);
    });
    
    // Sort conversations by lastMessageTime in descending order (newest first)
    conversations.sort((a, b) => {
      // Both lastMessageTime are Date objects
      if (a.lastMessageTime && b.lastMessageTime) {
        return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
      }
      return 0;
    });
    
    callback(conversations);
  }, (error) => {
    console.error('Error getting user conversations:', error);
    console.error('User ID:', userId);
    console.error('Current user:', auth.currentUser);
    // Handle permission errors
    if (error.message.includes('Missing or insufficient permissions')) {
      console.error('Firestore permissions error. Please check your security rules.');
      console.error('Current user authenticated:', !!auth.currentUser);
    }
  });
};

// Get messages for a conversation
export const getConversationMessages = (conversationId: string, callback: (messages: Message[]) => void) => {
  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', conversationId)
    // Removed orderBy to avoid the need for a composite index
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure timestamp is a Date object
      let timestamp = data.timestamp;
      if (timestamp && !(timestamp instanceof Date)) {
        if (typeof timestamp === 'object' && timestamp.seconds) {
          // Firestore timestamp
          timestamp = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        } else if (typeof timestamp === 'string') {
          // String timestamp
          timestamp = new Date(timestamp);
        } else {
          // Fallback to current date
          timestamp = new Date();
        }
      }
      
      messages.push({ 
        id: doc.id, 
        ...data,
        timestamp
      } as Message);
    });
    
    // Sort messages by timestamp in ascending order (oldest first)
    messages.sort((a, b) => {
      // Both timestamp are Date objects
      if (a.timestamp && b.timestamp) {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
      return 0;
    });
    
    callback(messages);
  }, (error) => {
    console.error('Error getting conversation messages:', error);
    // Handle permission errors
    if (error.message.includes('Missing or insufficient permissions')) {
      console.error('Firestore permissions error. Please check your security rules.');
    }
  });
};

// Send a new message
export const sendMessage = async (messageData: Omit<Message, 'id' | 'status' | 'type' | 'isEdited' | 'isDeleted'>) => {
  try {
    const messageRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      status: 'sent',
      type: 'text',
      isEdited: false,
      isDeleted: false,
      timestamp: new Date()
    });
    
    // Update conversation's last message
    const conversationRef = doc(db, 'conversations', messageData.conversationId);
    await updateDoc(conversationRef, {
      lastMessage: messageData.text,
      lastMessageTime: new Date()
    });
    
    return messageRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Send a file message
export const sendFileMessage = async (conversationId: string, file: File, messageType: 'image' | 'file' = 'file') => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');
    
    // Upload file to Firebase Storage
    const fileRef = ref(storage, `messages/${conversationId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);
    
    // Create message in Firestore
    const messageRef = await addDoc(collection(db, 'messages'), {
      conversationId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'User',
      text: messageType === 'image' ? '📷 Image' : `📁 ${file.name}`,
      timestamp: new Date(),
      status: 'sent',
      type: messageType,
      fileUrl,
      isEdited: false,
      isDeleted: false
    });
    
    // Update conversation's last message
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: messageType === 'image' ? '📷 Image' : `📁 ${file.name}`,
      lastMessageTime: new Date()
    });
    
    return messageRef.id;
  } catch (error) {
    console.error('Error sending file message:', error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId: string) => {
  // Don't try to mark messages as read if no messageId is provided
  if (!messageId) {
    return;
  }
  
  try {
    const messageRef = doc(db, 'messages', messageId);
    // First check if the document exists
    const docSnap = await getDoc(messageRef);
    if (!docSnap.exists()) {
      console.warn('Message does not exist:', messageId);
      return;
    }
    
    // Check if user is a participant in the conversation before updating
    const messageData = docSnap.data();
    const conversationRef = doc(db, 'conversations', messageData.conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (!conversationSnap.exists()) {
      console.warn('Conversation does not exist:', messageData.conversationId);
      return;
    }
    
    const conversationData = conversationSnap.data();
    if (!conversationData.participants.includes(auth.currentUser?.uid || '')) {
      console.warn('User is not a participant in this conversation');
      return;
    }
    
    await updateDoc(messageRef, {
      status: 'read',
      readAt: new Date()
    });
  } catch (error: any) {
    console.error('Error marking message as read:', error);
    // Don't throw the error to prevent app crashes, just log it
    // This is a non-critical operation
  }
};

// Update user status (online/offline)
export const updateUserStatus = async (userId: string, isOnline: boolean) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isOnline,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { uid: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Search users by UID, username or display name
export const searchUsers = async (searchQuery: string): Promise<User[]> => {
  try {
    // First, try to find user by UID if query looks like a UID
    if (searchQuery && searchQuery.length > 10) {
      try {
        const userDoc = await getDoc(doc(db, 'users', searchQuery));
        if (userDoc.exists()) {
          return [{ uid: userDoc.id, ...userDoc.data() } as User];
        }
      } catch (uidError: any) {
        // If UID search fails, continue with other search methods
        console.log('UID search failed, continuing with other methods');
        // Handle permission errors
        if (uidError.message.includes('Missing or insufficient permissions')) {
          console.error('Firestore permissions error during UID search. Please check your security rules.');
          console.error('Current user authenticated:', !!auth.currentUser);
          throw new Error('Permission denied. Please contact administrator.');
        }
      }
    }
    
    // Search by username
    const usersRef = collection(db, 'users');
    const usernameQuery = query(
      usersRef, 
      where('username', '>=', searchQuery),
      where('username', '<=', searchQuery + '\uf8ff'),
      limit(10)
    );
    
    const usernameSnapshot = await getDocs(usernameQuery);
    
    // Search by displayName
    const displayNameQuery = query(
      usersRef,
      where('displayName', '>=', searchQuery),
      where('displayName', '<=', searchQuery + '\uf8ff'),
      limit(10)
    );
    
    const displayNameSnapshot = await getDocs(displayNameQuery);
    
    // Combine results and remove duplicates
    const userMap = new Map<string, User>();
    
    usernameSnapshot.forEach((doc) => {
      userMap.set(doc.id, { uid: doc.id, ...doc.data() } as User);
    });
    
    displayNameSnapshot.forEach((doc) => {
      userMap.set(doc.id, { uid: doc.id, ...doc.data() } as User);
    });
    
    return Array.from(userMap.values());
  } catch (error: any) {
    console.error('Error searching users:', error);
    console.error('Search query:', searchQuery);
    console.error('Current user:', auth.currentUser);
    // Handle permission errors
    if (error.message.includes('Missing or insufficient permissions')) {
      console.error('Firestore permissions error during user search. Please check your security rules.');
      console.error('Current user authenticated:', !!auth.currentUser);
      throw new Error('Permission denied. Please contact administrator.');
    }
    throw error;
  }
};

// Send typing indicator
export const sendTypingIndicator = (socket: Socket | null, conversationId: string, userId: string) => {
  if (socket) {
    socket.emit('typing', { conversationId, userId });
  }
};

// Stop typing indicator
export const stopTypingIndicator = (socket: Socket | null, conversationId: string, userId: string) => {
  if (socket) {
    socket.emit('stopTyping', { conversationId, userId });
  }
};

// Edit message
export const editMessage = async (messageId: string, newText: string) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      text: newText,
      isEdited: true,
      editedAt: new Date()
    });
  } catch (error) {
    console.error('Error editing message:', error);
    throw error;
  }
};

// Delete message
export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      isDeleted: true,
      deletedAt: new Date(),
      text: 'This message was deleted'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
























