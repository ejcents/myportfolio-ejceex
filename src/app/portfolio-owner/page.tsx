"use client";

import { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import Link from 'next/link';
import { Search, Heart, Eye, User, Settings, LogOut, BookOpen, Plus, TrendingUp, Edit, Trash2, MessageSquare } from 'lucide-react';

export default function PortfolioOwnerDashboard() {
  const { user, isAuthenticated, logout } = useUserAuth();
  const [myPortfolios, setMyPortfolios] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
      if (!token) {
        setLoading(false);
        return;
      }

      // Fetch portfolios and messages in parallel
      const [portfoliosResponse, messagesResponse] = await Promise.all([
        fetch('/api/portfolios/my-portfolios', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/messages')
      ]);

      if (portfoliosResponse.ok) {
        const portfoliosData = await portfoliosResponse.json();
        setMyPortfolios(portfoliosData);
      }

      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.data?.messages || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) {
      return;
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
      if (!token) {
        console.error('No token found');
        return;
      }

      console.log('Deleting portfolio:', portfolioId);
      
      // Use the new simpler API endpoint
      const response = await fetch('/api/delete-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ portfolioId })
      });

      console.log('Delete response status:', response.status);
      
      const responseText = await response.text();
      console.log('Delete response text:', responseText);
      
      if (response.ok) {
        try {
          const result = JSON.parse(responseText);
          if (result.success) {
            setMyPortfolios(prev => prev.filter(p => p.id !== portfolioId));
            console.log('Portfolio deleted successfully');
          } else {
            console.error('Failed to delete portfolio:', result.error);
          }
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
        }
      } else {
        console.error('Delete failed with status:', response.status, responseText);
      }
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
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
          <p className="text-gray-600">Loading your portfolios...</p>
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
                href="/portfolio-owner/messages"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <MessageSquare size={16} />
                <span>Messages</span>
              </Link>
              <Link
                href="/portfolio-owner/settings"
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Portfolio Owner Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your creative portfolio and showcase your best work.
            </p>
          </div>
          <Link
            href="/portfolio-owner/create"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            <span>Create Portfolio</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolios</p>
                <p className="text-2xl font-bold text-gray-900">{myPortfolios.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myPortfolios.reduce((sum, p) => sum + (p.views || 0), 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myPortfolios.reduce((sum, p) => sum + (p.likes || 0), 0)}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(messages) ? messages.filter(m => m.status === 'unread').length : 0}
                </p>
                <p className="text-xs text-gray-500">unread</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* My Portfolios */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Portfolios</h2>
          </div>
          <div className="p-6">
            {myPortfolios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No portfolios yet</p>
                <p className="text-sm mb-4">Create your first portfolio to showcase your work</p>
                <Link
                  href="/portfolio-owner/create"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} />
                  <span>Create Portfolio</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPortfolios.map((portfolio) => (
                  <div key={portfolio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      {portfolio.images && JSON.parse(portfolio.images).length > 0 ? (
                        <img
                          src={JSON.parse(portfolio.images)[0]}
                          alt={portfolio.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{portfolio.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{portfolio.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{portfolio.views || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart size={16} />
                        <span>{portfolio.likes || 0}</span>
                      </span>
                      {portfolio.featured && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/portfolio-owner/edit/${portfolio.id}`}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
