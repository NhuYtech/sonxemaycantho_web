"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

// 🟢 Prevent duplicate Firebase initialization (fix for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app);
