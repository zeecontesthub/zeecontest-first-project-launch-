// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD2d6BRolLI7zMnJKwbQgoqUmCnwzI8Kg",
  authDomain: "zee-contest-a7417.firebaseapp.com",
  projectId: "zee-contest-a7417",
  storageBucket: "zee-contest-a7417.firebasestorage.app",
  messagingSenderId: "726957337131",
  appId: "1:726957337131:web:76169e4e9832112303586e",
  measurementId: "G-CXJSX0B044",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
