/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the app.
 * Uses Firebase onAuthStateChanged for real-time auth state sync.
 */

'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import {
    signIn as firebaseSignIn,
    signUp as firebaseSignUp,
    signOut as firebaseSignOut,
    resetPassword as firebaseResetPassword,
    getCurrentUser,
    SignUpData,
    SignInData,
} from '@/lib/firebase/auth';
import { User } from '@/types';
import {
    setAuthCookie,
    removeAuthCookie,
    refreshAuthCookie,
} from '@/lib/auth/session';

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    error: string | null;
    signIn: (data: SignInData) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    setFirebaseUser(firebaseUser);

                    // Set auth cookie for middleware
                    await setAuthCookie(firebaseUser);

                    // Fetch user data from Firestore
                    const userData = await getCurrentUser(firebaseUser);
                    setUser(userData);
                } else {
                    setFirebaseUser(null);
                    setUser(null);
                    removeAuthCookie();
                }
            } catch (err) {
                console.error('Auth state change error:', err);
                setError('Failed to load user data');
                removeAuthCookie();
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Refresh auth token periodically (every 50 minutes, tokens expire after 1 hour)
    useEffect(() => {
        if (!firebaseUser) return;

        const interval = setInterval(async () => {
            try {
                await refreshAuthCookie(firebaseUser);
            } catch (err) {
                console.error('Error refreshing auth token:', err);
            }
        }, 50 * 60 * 1000); // 50 minutes

        return () => clearInterval(interval);
    }, [firebaseUser]);

    const signIn = useCallback(async (data: SignInData) => {
        try {
            setError(null);
            setLoading(true);
            const userData = await firebaseSignIn(data);
            setUser(userData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signUp = useCallback(async (data: SignUpData) => {
        try {
            setError(null);
            setLoading(true);
            const userData = await firebaseSignUp(data);
            setUser(userData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            setError(null);
            await firebaseSignOut();
            setUser(null);
            setFirebaseUser(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const resetPassword = useCallback(async (email: string) => {
        try {
            setError(null);
            await firebaseResetPassword(email);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
            setError(errorMessage);
            throw err;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        firebaseUser,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
