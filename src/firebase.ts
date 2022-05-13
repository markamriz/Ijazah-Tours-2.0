import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAtHDPqBzmAsrtPSSe6t6wHw-C7VOQRZrU',
  authDomain: 'ijazah-tours.firebaseapp.com',
  projectId: 'ijazah-tours',
  storageBucket: 'ijazah-tours.appspot.com',
  messagingSenderId: '651209735843',
  appId: '1:651209735843:web:8d8e87aa1f95b8f1b38916',
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
