"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'PUBLIC' | 'PORTFOLIO_OWNER' | 'ADMIN' | 'SUPER_ADMIN' | 'SYSTEM_ADMIN';
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

interface UserAuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPortfolioOwner: boolean;
  isPublicUser: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  getAuthToken: () => string | null;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'PUBLIC' | 'PORTFOLIO_OWNER';
  bio?: string;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('user_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_token', data.token);
          localStorage.setItem('user_data', JSON.stringify(data.user));
        }
        
        // Redirect based on role
        if (data.user.role === 'PORTFOLIO_OWNER') {
          router.push('/portfolio-owner');
        } else if (data.user.role === 'PUBLIC') {
          router.push('/dashboard');
        } else if (['ADMIN', 'SUPER_ADMIN', 'SYSTEM_ADMIN'].includes(data.user.role)) {
          router.push('/admin');
        }
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_token', data.token);
          localStorage.setItem('user_data', JSON.stringify(data.user));
        }
        
        // Redirect based on role
        if (data.user.role === 'PORTFOLIO_OWNER') {
          router.push('/portfolio-owner');
        } else {
          router.push('/dashboard');
        }
        
        return true;
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
      }
    router.push('/');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('user_token') : ''}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const getAuthToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
  };

  const isPortfolioOwner = user?.role === 'PORTFOLIO_OWNER';
  const isPublicUser = user?.role === 'PUBLIC';
  const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'SYSTEM_ADMIN'].includes(user?.role || '');

  const value: UserAuthContextType = {
    user,
    isAuthenticated: !!user,
    isPortfolioOwner,
    isPublicUser,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateProfile,
    getAuthToken,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}
