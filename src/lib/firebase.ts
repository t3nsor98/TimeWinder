// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "timewinder-61l3x",
  "appId": "1:1037267214408:web:6f21c22bbd5aacc60e387d",
  "storageBucket": "timewinder-61l3x.firebasestorage.app",
  "apiKey": "AIzaSyBixOni6CCI-qm_mmxCgbL2QDevaAei9c4",
  "authDomain": "timewinder-61l3x.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1037267214408"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
