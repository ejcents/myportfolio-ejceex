"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdminProfile {
  name: string;
  email: string;
  title: string;
  bio: string;
  avatar: string;
}

interface AdminAccount {
  id: string;
  password: string;
  profile: AdminProfile;
  permissions: {
    canViewMessages: boolean;
    canEditMessages: boolean;
    canViewPortfolio: boolean;
    canEditPortfolio: boolean;
    canViewAnalytics: boolean;
    canEditProfile: boolean;
    canManageAdmins: boolean;
  };
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isSystemAdmin: boolean;
  role: 'admin' | 'superadmin' | 'systemadmin' | null;
  currentAdminId: string | null;
  profile: AdminProfile;
  permissions: AdminAccount['permissions'] | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<AdminProfile>) => void;
  resetAdminPassword: (newPassword: string) => void;
  resetSuperAdminPassword: (newPassword: string) => void;
  resetPasswordsToDefaults: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [role, setRole] = useState<'admin' | 'superadmin' | 'systemadmin' | null>(null);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const isSystemAdmin = role === 'systemadmin';
  const [profile, setProfile] = useState<AdminProfile>({
    name: 'Admin User',
    email: 'admin@ejceex.tk',
    title: 'Portfolio Administrator',
    bio: 'Managing the portfolio website and content.',
    avatar: ''
  });
  const [permissions, setPermissions] = useState<AdminAccount['permissions'] | null>(null);

  // Permission templates
  const fullPermissions = {
    canViewMessages: true,
    canEditMessages: true,
    canViewPortfolio: true,
    canEditPortfolio: true,
    canViewAnalytics: true,
    canEditProfile: true,
    canManageAdmins: true
  };

  // Default admin accounts with different permission levels
  const defaultAdminAccounts: AdminAccount[] = [
    {
      id: 'admin1',
      password: 'admin123',
      profile: {
        name: 'Admin 1',
        email: 'admin1@ejceex.tk',
        title: 'Senior Portfolio Administrator',
        bio: 'Experienced administrator managing portfolio content and user inquiries.',
        avatar: ''
      },
      permissions: fullPermissions // Full Access
    }
  ];

  // Load authentication state from localStorage on mount
  useEffect(() => {
    // Initialize default admin accounts if they don't exist
    const savedAdminAccounts = localStorage.getItem('adminAccounts');
    if (!savedAdminAccounts) {
      localStorage.setItem('adminAccounts', JSON.stringify(defaultAdminAccounts));
    }

    // Initialize super admin password if it doesn't exist
    if (!localStorage.getItem('superAdminPassword')) {
      localStorage.setItem('superAdminPassword', 'superadmin123');
    }

    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(authData.isAuthenticated);
        setIsSuperAdmin(authData.isSuperAdmin);
        setRole(authData.role);
        setCurrentAdminId(authData.currentAdminId);
        
        // Load the correct admin profile and permissions
        if (authData.currentAdminId && !authData.isSuperAdmin) {
          // Handle System Admin separately
          if (authData.currentAdminId === 'systemadmin') {
            setProfile({
              name: 'System Administrator',
              email: 'systemadmin@ejceex.tk',
              title: 'System Administrator',
              bio: 'System administrator managing infrastructure and Super Admin communications.',
              avatar: ''
            });
            setPermissions(fullPermissions);
          } else {
            // Handle regular admins
            const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
            const currentAdmin = adminAccounts.find((admin: AdminAccount) => admin.id === authData.currentAdminId);
            
            // Always give Admin 1 full permissions
            if (authData.currentAdminId === 'admin1') {
              // Load Admin 1's profile from default accounts if not found
              if (currentAdmin) {
                setProfile(currentAdmin.profile);
              } else {
                // Fallback to default Admin 1 profile
                setProfile({
                  name: 'Admin 1',
                  email: 'admin1@ejceex.tk',
                  title: 'Senior Portfolio Administrator',
                  bio: 'Experienced administrator managing portfolio content and user inquiries.',
                  avatar: ''
                });
              }
              setPermissions(fullPermissions);
            } else if (currentAdmin) {
              setProfile(currentAdmin.profile);
              setPermissions(currentAdmin.permissions);
            } else {
              // Fallback for other admins if account not found
              setPermissions({
                canViewMessages: false,
                canEditMessages: false,
                canViewPortfolio: true,
                canEditPortfolio: false,
                canViewAnalytics: false,
                canEditProfile: true,
                canManageAdmins: false
              });
            }
          }
        } else if (authData.isSuperAdmin) {
          // Super admin gets full permissions
          setPermissions(fullPermissions);
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    console.log('Login attempt with password:', password);
    
    // Get super admin password
    const superAdminPassword = localStorage.getItem('superAdminPassword') || 'superadmin123';
    console.log('Super admin password:', superAdminPassword);
    
    // Get admin accounts
    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
    console.log('Admin accounts:', adminAccounts.map((acc: AdminAccount) => ({ id: acc.id, password: acc.password })));
    
    // Check if Admin 泄漏 specifically exists
    const admin1 = adminAccounts.find((admin: AdminAccount) => admin.id === 'admin1');
    console.log('Admin 1 account found:', admin1 ? 'YES' : 'NO', admin1 ? { id: admin1.id, password: admin1.password } : null);
    
    // Check super admin password first
    if (password === superAdminPassword) {
      console.log('Super admin login successful');
      const authData = {
        isAuthenticated: true,
        isSuperAdmin: true,
        role: 'superadmin' as const,
        currentAdminId: null
      };
      
      setIsAuthenticated(authData.isAuthenticated);
      setIsSuperAdmin(authData.isSuperAdmin);
      setRole(authData.role);
      setCurrentAdminId(authData.currentAdminId);
      setPermissions(fullPermissions); // Super admin gets full permissions
      
      // Reset profile to default for super admin
      setProfile({
        name: 'Super Admin',
        email: 'superadmin@ejceex.tk',
        title: 'Super Administrator',
        bio: 'System administrator with full access to all features.',
        avatar: ''
      });
      
      // Save to localStorage
      localStorage.setItem('adminAuth', JSON.stringify(authData));
      return true;
    }
    
    // Check system admin password
    if (password === 'systemadmin123') {
      const authData = {
        isAuthenticated: true,
        isSuperAdmin: false,
        role: 'systemadmin' as const,
        currentAdminId: 'systemadmin'
      };
      
      setIsAuthenticated(authData.isAuthenticated);
      setIsSuperAdmin(authData.isSuperAdmin);
      setRole(authData.role);
      setCurrentAdminId(authData.currentAdminId);
      setPermissions(fullPermissions); // System admin gets full permissions
      
      // Set profile for system admin
      setProfile({
        name: 'System Administrator',
        email: 'systemadmin@ejceex.tk',
        title: 'System Administrator',
        bio: 'System administrator managing infrastructure and Super Admin communications.',
        avatar: ''
      });
      
      // Save to localStorage
      localStorage.setItem('adminAuth', JSON.stringify(authData));
      return true;
    }
    
    // Check admin accounts
    console.log('Admin accounts available for login:', adminAccounts.map((acc: AdminAccount) => ({ id: acc.id, password: acc.password, permissions: acc.permissions })));
    const matchedAdmin = adminAccounts.find((admin: AdminAccount) => admin.password === password);
    console.log('Matched admin:', matchedAdmin ? matchedAdmin.id : 'none');
    
    if (matchedAdmin) {
      console.log('Admin login successful for:', matchedAdmin.id);
      console.log('Permissions being set for', matchedAdmin.id, ':', matchedAdmin.permissions);
      const authData = {
        isAuthenticated: true,
        isSuperAdmin: false,
        role: 'admin' as const,
        currentAdminId: matchedAdmin.id
      };
      
      setIsAuthenticated(authData.isAuthenticated);
      setIsSuperAdmin(authData.isSuperAdmin);
      setRole(authData.role);
      setCurrentAdminId(matchedAdmin.id);
      setProfile(matchedAdmin.profile);
      setPermissions(matchedAdmin.permissions); // Set admin-specific permissions
      console.log('Set permissions for', matchedAdmin.id, ':', matchedAdmin.permissions);
      
      // Fallback: Ensure Admin 1 always has full permissions
      if (matchedAdmin.id === 'admin1') {
        console.log('Admin 1 detected, ensuring full permissions');
        setPermissions(fullPermissions);
      }
      
      // Save to localStorage
      localStorage.setItem('adminAuth', JSON.stringify(authData));
      return true;
    }
    
    console.log('Login failed - no matching account found');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    setRole(null);
    setCurrentAdminId(null);
    setPermissions(null);
    
    // Remove from localStorage
    localStorage.removeItem('adminAuth');
  };

  const updateProfile = (updatedProfile: Partial<AdminProfile>) => {
    const newProfile = { ...profile, ...updatedProfile };
    setProfile(newProfile);
    
    // Update the admin account in localStorage if not super admin
    if (currentAdminId && !isSuperAdmin) {
      const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
      const updatedAccounts = adminAccounts.map((admin: AdminAccount) => 
        admin.id === currentAdminId 
          ? { ...admin, profile: newProfile }
          : admin
      );
      localStorage.setItem('adminAccounts', JSON.stringify(updatedAccounts));
    }
  };

  const resetAdminPassword = (newPassword: string) => {
    // This function is deprecated with multiple admin accounts
    // Individual admin passwords should be managed through the accounts array
    console.warn('resetAdminPassword is deprecated. Use account management instead.');
  };

  const resetSuperAdminPassword = (newPassword: string) => {
    // Store super admin password in localStorage
    localStorage.setItem('superAdminPassword', newPassword);
  };

  const resetPasswordsToDefaults = () => {
    // Reset admin accounts to defaults
    localStorage.setItem('adminAccounts', JSON.stringify(defaultAdminAccounts));
    localStorage.setItem('superAdminPassword', 'superadmin123');
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      isSuperAdmin, 
      isSystemAdmin,
      role, 
      currentAdminId,
      profile,
      permissions,
      login, 
      logout, 
      updateProfile,
      resetAdminPassword,
      resetSuperAdminPassword,
      resetPasswordsToDefaults
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
