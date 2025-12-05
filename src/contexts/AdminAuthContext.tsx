"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  role: 'admin' | 'superadmin' | null;
  login: (role: 'admin' | 'superadmin') => void;
  logout: () => void;
  resetAdminPassword: (newPassword: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [role, setRole] = useState<'admin' | 'superadmin' | null>(null);

  const login = (userRole: 'admin' | 'superadmin') => {
    setIsAuthenticated(true);
    setIsSuperAdmin(userRole === 'superadmin');
    setRole(userRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    setRole(null);
  };

  const resetAdminPassword = (newPassword: string) => {
    // In a real app, this would call an API to update the password
    // For now, we'll store it in localStorage
    localStorage.setItem('adminPassword', newPassword);
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      isSuperAdmin, 
      role, 
      login, 
      logout, 
      resetAdminPassword 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
