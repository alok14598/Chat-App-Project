import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey:import.meta.env.VITE_API_KEY,
  authDomain: "chatting-app-7b75c.firebaseapp.com",
  projectId: "chatting-app-7b75c",
  storageBucket: "chatting-app-7b75c.appspot.com",
  messagingSenderId: "663042214553",
  appId: "1:663042214553:web:3cfa933d659548caf80608"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()