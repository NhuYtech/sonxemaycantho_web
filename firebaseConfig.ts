"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcn8S4zCL7f7JqXqofDm-8Cmdy2W2DT-k",
  authDomain: "sonxemay-cantho.firebaseapp.com",
  databaseURL:
    "https://sonxemay-cantho-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sonxemay-cantho",
  storageBucket: "sonxemay-cantho.appspot.com",
  messagingSenderId: "xxxxxx",
  appId: "1:xxxx:web:xxxxxx",
};

// 🟢 Ngăn lỗi "Firebase App already exists"
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
export const auth = getAuth(app);
