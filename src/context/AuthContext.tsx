import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  isFirebaseConfigured,
  FirebaseUser
} from '../config/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  idToken: string | null;
  loading: boolean;
  isFirebaseLive: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  demoLogin: (role?: 'user' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'chat_replyzer_demo_user';
const LOCAL_STORAGE_TOKEN = 'chat_replyzer_demo_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state when real Firebase is active
  useEffect(() => {
    let resolved = false;

    if (isFirebaseConfigured && auth) {
      // Safety timeout so page never stays stuck loading if Firebase is slow/unreachable
      const safetyTimeout = setTimeout(() => {
        if (!resolved) {
          const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
          const savedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
          if (savedUser && savedToken) {
            try {
              setCurrentUser(JSON.parse(savedUser));
              setIdToken(savedToken);
            } catch {
              localStorage.removeItem(LOCAL_STORAGE_KEY);
              localStorage.removeItem(LOCAL_STORAGE_TOKEN);
            }
          }
          setLoading(false);
        }
      }, 2000);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        resolved = true;
        clearTimeout(safetyTimeout);
        setFirebaseUser(user);
        if (user) {
          const token = await user.getIdToken();
          setIdToken(token);
          setCurrentUser({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || undefined,
            emailVerified: user.emailVerified,
            role: user.email?.includes('admin') ? 'admin' : 'user',
            createdAt: user.metadata.creationTime || new Date().toISOString(),
          });
        } else {
          // If no Firebase session, check if demo login was used
          const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
          const savedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
          if (savedUser && savedToken) {
            try {
              setCurrentUser(JSON.parse(savedUser));
              setIdToken(savedToken);
            } catch {
              localStorage.removeItem(LOCAL_STORAGE_KEY);
              localStorage.removeItem(LOCAL_STORAGE_TOKEN);
              setIdToken(null);
              setCurrentUser(null);
            }
          } else {
            setIdToken(null);
            setCurrentUser(null);
          }
        }
        setLoading(false);
      });

      return () => {
        clearTimeout(safetyTimeout);
        unsubscribe();
      };
    } else {
      // Offline / Developer sandbox fallback
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
      if (savedUser && savedToken) {
        try {
          setCurrentUser(JSON.parse(savedUser));
          setIdToken(savedToken);
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_TOKEN);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        setIdToken(token);
      } else {
        // Fallback simulation mode
        const mockUid = 'usr_' + Math.random().toString(36).substring(2, 9);
        const mockProfile: UserProfile = {
          uid: mockUid,
          email,
          displayName: email.split('@')[0],
          emailVerified: true,
          role: email.includes('admin') ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock_jwt_token_' + btoa(JSON.stringify({ uid: mockUid, email }));
        setCurrentUser(mockProfile);
        setIdToken(mockToken);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockProfile));
        localStorage.setItem(LOCAL_STORAGE_TOKEN, mockToken);
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string): Promise<void> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        await sendEmailVerification(userCredential.user);
        const token = await userCredential.user.getIdToken();
        setIdToken(token);
        setCurrentUser({
          uid: userCredential.user.uid,
          email,
          displayName,
          emailVerified: false,
          role: 'user',
          createdAt: new Date().toISOString(),
        });
      } else {
        // Fallback simulation mode
        const mockUid = 'usr_' + Math.random().toString(36).substring(2, 9);
        const mockProfile: UserProfile = {
          uid: mockUid,
          email,
          displayName,
          emailVerified: false,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock_jwt_token_' + btoa(JSON.stringify({ uid: mockUid, email }));
        setCurrentUser(mockProfile);
        setIdToken(mockToken);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockProfile));
        localStorage.setItem(LOCAL_STORAGE_TOKEN, mockToken);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const token = await result.user.getIdToken();
        setIdToken(token);
      } else {
        // Fallback simulation mode
        const mockUid = 'google_' + Math.random().toString(36).substring(2, 9);
        const mockProfile: UserProfile = {
          uid: mockUid,
          email: 'alex.creator@example.com',
          displayName: 'Alex Rivers',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          emailVerified: true,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock_google_jwt_' + mockUid;
        setCurrentUser(mockProfile);
        setIdToken(mockToken);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockProfile));
        localStorage.setItem(LOCAL_STORAGE_TOKEN, mockToken);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    setIdToken(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 600));
    }
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (isFirebaseConfigured && firebaseUser) {
      await sendEmailVerification(firebaseUser);
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const demoLogin = async (role: 'user' | 'admin' = 'user'): Promise<void> => {
    setLoading(true);
    try {
      const mockUid = role === 'admin' ? 'admin_root_1' : 'demo_user_1';
      const mockProfile: UserProfile = {
        uid: mockUid,
        email: role === 'admin' ? 'admin@chatreplyzer.ai' : 'demo@chatreplyzer.ai',
        displayName: role === 'admin' ? 'System Administrator' : 'Sarah Khan',
        emailVerified: true,
        role,
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'mock_jwt_demo_' + role;
      setCurrentUser(mockProfile);
      setIdToken(mockToken);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockProfile));
      localStorage.setItem(LOCAL_STORAGE_TOKEN, mockToken);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        idToken,
        loading,
        isFirebaseLive: isFirebaseConfigured,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        resendVerificationEmail,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
