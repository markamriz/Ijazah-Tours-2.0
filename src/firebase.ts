// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_DJ3-vWQuSzbMo_r3Uci7Mxfu4yENwIk",
  authDomain: "ijazah-tours-2.firebaseapp.com",
  projectId: "ijazah-tours-2",
  storageBucket: "ijazah-tours-2.appspot.com",
  messagingSenderId: "588578726216",
  appId: "1:588578726216:web:aedd95334d7493e36c537d",
  measurementId: "G-CV10HJS6K9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };