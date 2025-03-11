// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    getDocs, getDoc,
    addDoc, 
    deleteDoc,  
    doc,
    setDoc,
    serverTimestamp ,
    updateDoc,
    orderBy,
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLgB2Y6VEL0Y51oOSrSTZVmUqmnL48J58",
  authDomain: "project-1-e84b9.firebaseapp.com",
  projectId: "project-1-e84b9",
  storageBucket: "project-1-e84b9.appspot.com",
  messagingSenderId: "436819843101",
  appId: "1:436819843101:web:aeabedfb4732569b500ef4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export Firebase Modules



export { 
  auth, db, storage, 
  collection, getDocs, addDoc,  getDoc,
  deleteDoc, doc, setDoc, serverTimestamp ,
  updateDoc,orderBy,query,where
};


