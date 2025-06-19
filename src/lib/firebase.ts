// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBrgqNZk5tvx7-wReIGFmtskjSuxytTpfw",
  authDomain: "qyou-bracelet.firebaseapp.com",
  projectId: "qyou-bracelet",
  storageBucket: "qyou-bracelet.firebasestorage.app",
  messagingSenderId: "878870816371",
  appId: "1:878870816371:web:03a81ba9b612d7fa6f2c06"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, storage };

