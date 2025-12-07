"use client";

import React from "react";
import { Shield, LogOut, User, LayoutDashboard, Mailbox, FileText, Settings, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentPage: string;
}

const adminNavigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    current: false,
    color: 'blue'
  },
  {
    name: 'Messages',
    href: '/admin/messages',
    icon: Mailbox,
    current: false,
    color: 'green'
  },
  {
    name: 'Portfolio',
    href: '/admin/portfolio',
    icon: FileText,
    current: false,
    color: 'purple'
  },
  {
    name: 'Profile',
    href: '/admin/profile',
    icon: User,
    current: false,
    color: 'indigo'
  }
];

const systemAdminNavigationItems = [
  {
    name: 'System Admin',
    href: '/system',
    icon: Settings,
    current: false,
    color: 'blue'
  },
  {
    name: 'Messages',
    href: '/system/messages',
    icon: Mailbox,
    current: false,
    color: 'green'
  },
  {
    name: 'Profile',
    href: '/system/profile',
    icon: User,
    current: false,
    color: 'indigo'
  }
];

const superAdminNavigationItems = [
  {
    name: 'Dashboard',
    href: '/super',
    icon: LayoutDashboard,
    current: false,
    color: 'purple'
  },
  {
    name: 'Messages',
    href: '/super/messages',
    icon: MessageSquare,
    current: false,
    color: 'green'
  },
  {
    name: 'Users',
    href: '/super/users',
    icon: User,
    current: false,
    color: 'orange'
  },
  {
    name: 'Profile',
    href: '/super/profile',
    icon: Shield,
    current: false,
    color: 'indigo'
  }
];

export default function AdminLayout({ children, title, subtitle, currentPage }: AdminLayoutProps) {
  const router = useRouter();
  const { role, logout, profile, permissions } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  // Choose navigation items based on role
  const baseNavigationItems = role === 'superadmin' ? superAdminNavigationItems : 
                              role === 'systemadmin' ? systemAdminNavigationItems : 
                              adminNavigationItems;

  // Filter navigation based on permissions
  const filteredNavigation = baseNavigationItems.filter(item => {
    // Super Admin and System Admin see all items
    if (role === 'superadmin' || role === 'systemadmin') {
      return true;
    }
    
    if (!permissions) {
      return false; // Hide everything if no permissions
    }
    
    let shouldShow = false;
    switch (item.name) {
      case 'Dashboard':
        shouldShow = true; // Always show dashboard
        break;
      case 'Messages':
        shouldShow = permissions.canViewMessages;
        break;
      case 'Portfolio':
        shouldShow = permissions.canViewPortfolio;
        break;
      case 'Analytics':
        shouldShow = permissions.canViewAnalytics;
        break;
      case 'Profile':
        shouldShow = permissions.canEditProfile;
        break;
      default:
        shouldShow = true;
    }
    
    return shouldShow;
  });

  // Update current page in navigation
  const updatedNavigation = filteredNavigation.map(item => ({
    ...item,
    current: item.href === currentPage
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex items-center space-x-3 mr-8">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    role === 'superadmin' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : role === 'systemadmin'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}>
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {role === 'superadmin' ? 'Super Admin' : 
                     role === 'systemadmin' ? 'System Admin' : 'Admin'}
                  </h1>
                  <p className="text-xs text-gray-500">Management</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-1">
                {updatedNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.href)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        item.current
                          ? `bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-200`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} className={item.current ? `text-${item.color}-600` : ''} />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side - User info and Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Welcome, {profile.name}!</p>
                <p className="text-xs text-gray-500">
                    {role === 'superadmin' ? 'Super Administrator' : 
                     role === 'systemadmin' ? 'System Administrator' : 'Portfolio Administrator'}
                  </p>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {updatedNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                    item.current
                      ? `bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-200`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={item.current ? `text-${item.color}-600` : ''} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
