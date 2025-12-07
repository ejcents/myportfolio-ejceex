"use client";

import { ReactNode } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface PermissionGuardProps {
  children: ReactNode;
  permission: keyof ReturnType<typeof useAdminAuth>['permissions'];
  fallback?: ReactNode;
}

export function PermissionGuard({ children, permission, fallback = null }: PermissionGuardProps) {
  const { permissions } = useAdminAuth();
  
  if (!permissions) return fallback;
  
  return permissions[permission] ? <>{children}</> : <>{fallback}</>;
}

interface PermissionProps {
  children: ReactNode;
  permissions: {
    canViewMessages?: boolean;
    canEditMessages?: boolean;
    canViewPortfolio?: boolean;
    canEditPortfolio?: boolean;
    canViewAnalytics?: boolean;
    canEditProfile?: boolean;
    canManageAdmins?: boolean;
  };
  fallback?: ReactNode;
}

export function Permissions({ children, permissions: requiredPermissions, fallback = null }: PermissionProps) {
  const { permissions } = useAdminAuth();
  
  if (!permissions) return fallback;
  
  const hasAllPermissions = Object.entries(requiredPermissions).every(
    ([key, required]) => !required || permissions[key as keyof typeof permissions]
  );
  
  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
}
