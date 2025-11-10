import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  firebaseUser?: FirebaseUser;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'owner' | 'admin') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'user' | 'owner' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get role from localStorage or default to 'user'
        const savedRole = localStorage.getItem('userRole') as 'user' | 'owner' | 'admin' || 'user';
        
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: savedRole,
          firebaseUser
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'owner' | 'admin') => {
    try {
      setIsLoading(true);
      const firebaseUser = await signInWithEmail(email, password);
      localStorage.setItem('userRole', role);
      
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0],
        email: firebaseUser.email || email,
        role,
        firebaseUser
      });
      
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const firebaseUser = await signInWithGoogle();
      const role = localStorage.getItem('userRole') as 'user' | 'owner' | 'admin' || 'user';
      
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        role,
        firebaseUser
      });
      
      toast.success('Successfully logged in with Google!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'owner' | 'admin') => {
    try {
      setIsLoading(true);
      const firebaseUser = await signUpWithEmail(email, password);
      localStorage.setItem('userRole', role);
      
      // You might want to update the user's display name here
      // await updateProfile(firebaseUser, { displayName: name });
      
      setUser({
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email || email,
        role,
        firebaseUser
      });
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logOut();
      localStorage.removeItem('userRole');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Failed to logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}