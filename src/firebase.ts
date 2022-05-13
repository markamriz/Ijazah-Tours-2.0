import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: 'AIzaSyB_DJ3-vWQuSzbMo_r3Uci7Mxfu4yENwIk',
  authDomain: 'ijazah-tours-2.firebaseapp.com',
  projectId: 'ijazah-tours-2',
  storageBucket: 'ijazah-tours-2.appspot.com',
  messagingSenderId: '588578726216',
  appId: '1:588578726216:web:aedd95334d7493e36c537d',
  measurementId: "G-CV10HJS6K9"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };