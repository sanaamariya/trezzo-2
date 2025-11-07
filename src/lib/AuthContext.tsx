import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from './mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'owner' | 'admin') => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'user' | 'owner' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'user' | 'owner' | 'admin') => {
    // Mock login - in real app, this would call Firebase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: `${role}1`,
      name: email.split('@')[0],
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      favoriteRestaurants: role === 'user' ? ['r1', 'r2'] : [],
      badges: [],
      reviewCount: 0,
      points: 0,
    };
    
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string, role: 'user' | 'owner' | 'admin') => {
    // Mock signup - in real app, this would call Firebase Auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: `${role}${Date.now()}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      favoriteRestaurants: [],
      badges: [],
      reviewCount: 0,
      points: 0,
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
