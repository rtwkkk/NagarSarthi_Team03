import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  region: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, region: string) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (data: Partial<Omit<User, 'id' | 'email' | 'lastLogin'>>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch additional profile data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              name: userData.displayName || firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: userData.role || 'Administrator',
              region: userData.region || 'Jamshedpur',
              lastLogin: new Date().toISOString(),
            });
          } else {
            // Create default profile if doesn't exist
            const defaultUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'Administrator',
              region: 'Jamshedpur',
              lastLogin: new Date().toISOString(),
            };

            await setDoc(userDocRef, {
              displayName: defaultUser.name,
              email: defaultUser.email,
              role: defaultUser.role,
              region: defaultUser.region,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });

            setUser(defaultUser);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Update last login time
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(
        userDocRef,
        { lastLogin: serverTimestamp() },
        { merge: true }
      );

      return true;
    } catch (error: any) {
      console.error('Sign in error:', error);

      // Handle specific error codes
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        alert('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        alert('Too many failed attempts. Please try again later.');
      } else {
        alert('Failed to sign in. Please try again.');
      }

      setLoading(false);
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    region: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Create user profile in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        displayName: name,
        email: email,
        role: 'Administrator',
        region: region,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      return true;
    } catch (error: any) {
      console.error('Sign up error:', error);

      // Handle specific error codes
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already registered');
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email address');
      } else {
        alert('Failed to create account. Please try again.');
      }

      setLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfileData = async (data: Partial<Omit<User, 'id' | 'email' | 'lastLogin'>>): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.id);

      const updatePayload: any = {
        updatedAt: serverTimestamp()
      };

      if (data.name) updatePayload.displayName = data.name;
      if (data.role) updatePayload.role = data.role;
      if (data.region) updatePayload.region = data.region;

      await setDoc(userDocRef, updatePayload, { merge: true });

      // Update local state
      setUser(prev => prev ? {
        ...prev,
        ...data
      } : null);

      // Update Firebase Auth display name if name changed
      if (data.name && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: data.name
        });
      }

      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Failed to update profile settings. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signIn, signUp, signOut, updateProfile: updateProfileData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}