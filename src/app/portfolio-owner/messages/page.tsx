"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Mail, User, Clock, CheckCircle, ArrowLeft, Search, Filter } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const { user, isAuthenticated, isPortfolioOwner } = useUserAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (isAuthenticated && isPortfolioOwner) {
      fetchMessages();
    }
  }, [isAuthenticated, isPortfolioOwner]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data?.messages || []);
      } else {
        setError('Failed to fetch messages');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'read' }),
      });
      
      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, status: 'read' } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const filteredMessages = Array.isArray(messages) ? messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || msg.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) : [];

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

  if (!isPortfolioOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is only available to portfolio owners.</p>
          <Link
            href="/browse"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            <span>Browse Portfolios</span>
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
          <p className="text-gray-600">Loading messages...</p>
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
                href="/portfolio-owner"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">View and manage inquiries from clients and users</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {Array.isArray(messages) ? messages.filter(m => m.status === 'unread').length : 0} unread
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unread' | 'read')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t received any messages yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg shadow-sm border ${
                  message.status === 'unread' ? 'border-blue-200' : 'border-gray-200'
                } hover:shadow-md transition-shadow`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{message.name}</h3>
                          <p className="text-sm text-gray-600">{message.email}</p>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {message.status === 'unread' && (
                        <button
                          onClick={() => markAsRead(message.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Mark as read"
                        >
                          <CheckCircle size={20} />
                        </button>
                      )}
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {message.status === 'unread' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-blue-600 font-medium">Unread</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
