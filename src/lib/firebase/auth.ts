/**
 * Firebase Authentication Utilities
 *
 * Provides authentication functions with proper error handling
 * and TypeScript support.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  AuthError,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "./config";
import { User, UserDocument, Specialty, UserRole } from "../../types";

/**
 * Custom error messages for better UX
 */
const getAuthErrorMessage = (error: AuthError): string => {
  const errorMessages: Record<string, string> = {
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/email-already-in-use": "An account with this email already exists",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "This account has been disabled",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    "auth/network-request-failed":
      "Network error. Please check your connection",
  };

  return errorMessages[error.code] || "An error occurred during authentication";
};

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone: string;
  specialty: Specialty;
  role?: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUp = async (data: SignUpData): Promise<User> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );

    const { user: firebaseUser } = userCredential;

    // Update profile with display name
    await updateProfile(firebaseUser, {
      displayName: data.name,
    });

    // Create user document in Firestore
    const userData: UserDocument = {
      uid: firebaseUser.uid,
      email: data.email,
      name: data.name,
      phone: data.phone,
      specialty: data.specialty,
      role: data.role || "staff",
      photoURL: firebaseUser.photoURL || undefined,
      isActive: true,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      lastLoginAt: serverTimestamp() as Timestamp,
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userData);

    // Return User object (timestamps will be set on server)
    return {
      ...userData,
      createdAt: undefined,
      updatedAt: undefined,
      lastLoginAt: undefined,
    };
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError));
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (data: SignInData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );

    // Update last login timestamp
    await updateDoc(doc(db, "users", userCredential.user.uid), {
      lastLoginAt: serverTimestamp(),
    });

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data() as UserDocument;

    return {
      ...userData,
      createdAt: userData.createdAt?.toDate(),
      updatedAt: userData.updatedAt?.toDate(),
      lastLoginAt: userData.lastLoginAt?.toDate(),
    };
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError));
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError));
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError));
  }
};

/**
 * Update user password (requires recent authentication)
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("No user logged in");
    }

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(getAuthErrorMessage(authError));
  }
};

/**
 * Get current user data from Firestore
 */
export const getCurrentUser = async (
  firebaseUser: FirebaseUser,
): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data() as UserDocument;

    return {
      ...userData,
      createdAt: userData.createdAt?.toDate(),
      updatedAt: userData.updatedAt?.toDate(),
      lastLoginAt: userData.lastLoginAt?.toDate(),
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>,
): Promise<void> => {
  try {
    // Remove fields that shouldn't be updated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uid, createdAt, ...allowedUpdates } = updates;

    await updateDoc(doc(db, "users", userId), {
      ...allowedUpdates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile");
  }
};
