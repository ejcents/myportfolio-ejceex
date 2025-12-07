"use client";

import { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import Link from 'next/link';
import { Search, Heart, Eye, User, Settings, LogOut, BookOpen, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useUserAuth();
  const [savedPortfolios, setSavedPortfolios] = useState<any[]>([]);
  const [viewedPortfolios, setViewedPortfolios] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's dashboard data
    const fetchUserData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/user/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSavedPortfolios(data.savedPortfolios || []);
          setViewedPortfolios(data.viewedPortfolios || []);
          setFollowing(data.following || []);
        } else {
          console.error('Failed to fetch dashboard data');
          // Set empty arrays on error
          setSavedPortfolios([]);
          setViewedPortfolios([]);
          setFollowing([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setSavedPortfolios([]);
        setViewedPortfolios([]);
        setFollowing([]);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleSavePortfolio = async (portfolioId: string) => {
    try {
      // In a real app, you would call your API to save/unsave a portfolio
      console.log('Saving portfolio:', portfolioId);
    } catch (error) {
      console.error('Failed to save portfolio:', error);
    }
  };

  const handleUnsavePortfolio = async (portfolioId: string) => {
    try {
      // In a real app, you would call your API to unsave a portfolio
      console.log('Unsaving portfolio:', portfolioId);
    } catch (error) {
      console.error('Failed to unsave portfolio:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <Link
            href="/auth/login"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <User size={16} />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                PortfolioHub
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/browse" className="text-gray-700 hover:text-gray-900">
                  Browse
                </Link>
                <Link href="/featured" className="text-gray-700 hover:text-gray-900">
                  Featured
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar || '/default-avatar.svg'}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-gray-600">
            Discover and save amazing creative work from talented professionals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Portfolios</p>
                <p className="text-2xl font-bold text-gray-900">{savedPortfolios.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Viewed</p>
                <p className="text-2xl font-bold text-gray-900">{viewedPortfolios.length}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Following</p>
                <p className="text-2xl font-bold text-gray-900">{following.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activity Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedPortfolios.length + viewedPortfolios.length + (following.length * 2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/browse"
                className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Search className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Browse Portfolios</p>
                  <p className="text-sm text-gray-600">Discover creative work</p>
                </div>
              </Link>
              <Link
                href="/featured"
                className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <BookOpen className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Featured Work</p>
                  <p className="text-sm text-gray-600">See highlighted portfolios</p>
                </div>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-6 w-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Profile Settings</p>
                  <p className="text-sm text-gray-600">Update your information</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Start browsing portfolios to see your activity here</p>
              <Link
                href="/browse"
                className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Search size={16} />
                <span>Start Browsing</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
