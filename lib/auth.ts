import { auth } from "@/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
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

// Check if email is already registered
export async function checkIfUserExists(email: string): Promise<boolean> {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
}

// Google register with existence check
export async function registerWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  
  const result = await signInWithPopup(auth, provider);
  const email = result.user.email;
  
  if (!email) {
    throw new Error("No email found in Google account");
  }
  
  // Check if this is a new user (Firebase automatically handles this)
  // additionalUserInfo.isNewUser tells us if this is first time sign-in
  return result;
}


