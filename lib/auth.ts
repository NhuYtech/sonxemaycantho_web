import { auth } from "@/lib/firebase";
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

// ✨ Thêm phần này để đăng nhập bằng Google
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
