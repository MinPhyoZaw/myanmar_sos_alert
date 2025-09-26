import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace these values with your actual Firebase project config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCdbjj9Z7tDrWmBJo0xWCzheNixnQrTrck",
  authDomain: "missing-link-myanmar.firebaseapp.com",
  projectId: "missing-link-myanmar",
  storageBucket: "missing-link-myanmar.firebasestorage.app",
  messagingSenderId: "218897396365",
  appId: "1:218897396365:web:b74562485d8e79ea6da8c4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
