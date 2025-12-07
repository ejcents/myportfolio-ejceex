"use client";

import { Plus, User, LogIn, UserPlus } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, isAuthenticated, isPortfolioOwner } = useUserAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PortfolioHub
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/browse" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Browse
              </Link>
              <Link href="/featured" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Featured
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {isPortfolioOwner ? (
                  <Link
                    href="/portfolio-owner/create"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <Plus size={16} />
                    <span>Create</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <User size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.avatar || '/api/placeholder/32/32'}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
