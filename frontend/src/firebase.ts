// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADNGyU5_kPk1wmwXFOdSI5Ej8HxLf8s3U",
  authDomain: "chat-now-c2ee7.firebaseapp.com",
  projectId: "chat-now-c2ee7",
  storageBucket: "chat-now-c2ee7.firebasestorage.app",
  messagingSenderId: "583091072983",
  appId: "1:583091072983:web:f6a9a5936706497e642592",
  measurementId: "G-L92TL9XRSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;