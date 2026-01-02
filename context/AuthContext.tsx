
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('l8x_auth');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    // Hardcoded Admin Creds check
    if (email === 'admin@law8x1.com' && pass === 'Law8x1@123') {
      const admin: User = { uid: 'admin-1', email, displayName: 'System Admin', role: 'admin' };
      setUser(admin);
      localStorage.setItem('l8x_auth', JSON.stringify(admin));
      setLoading(false);
      return true;
    }
    
    // Simple mock logic for users
    if (pass.length >= 6) {
      const newUser: User = { uid: `u-${Date.now()}`, email, displayName: email.split('@')[0], role: 'user' };
      setUser(newUser);
      localStorage.setItem('l8x_auth', JSON.stringify(newUser));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const register = async (email: string, name: string): Promise<boolean> => {
    setLoading(true);
    const newUser: User = { uid: `u-${Date.now()}`, email, displayName: name, role: 'user' };
    setUser(newUser);
    localStorage.setItem('l8x_auth', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('l8x_auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
