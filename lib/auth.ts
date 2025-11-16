import { auth } from "@/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function resetPassword(email: string): Promise<void> {
  return await sendPasswordResetEmail(auth, email);
}

export async function logout(): Promise<void> {
  return await signOut(auth);
}

// Google OAuth sign-in helper
export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  // Force account picker to show every time
  provider.setCustomParameters({
    prompt: "select_account",
  });
  return await signInWithPopup(auth, provider);
}


