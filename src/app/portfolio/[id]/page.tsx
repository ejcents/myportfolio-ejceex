"use client";

import { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Eye, User, Calendar, Share2, MessageCircle, Mail, Plus, LogIn, UserPlus } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';

export default function PortfolioDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isPortfolioOwner } = useUserAuth();
  const portfolioId = resolvedParams.id;
  
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, [portfolioId]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`);
      
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      } else if (response.status === 404) {
        setError('Portfolio not found');
      } else {
        setError('Failed to load portfolio');
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: portfolio.title,
          text: portfolio.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else if (typeof window !== 'undefined') {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This portfolio may have been removed or is no longer available.'}</p>
          <Link
            href="/browse"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Portfolios
          </Link>
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
                <Link href="/browse" className="text-blue-600 font-medium">
                  Browse
                </Link>
                <Link href="/featured" className="text-gray-700 hover:text-gray-900">
                  Featured
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-gray-900">
                  About
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
              {isAuthenticated ? (
                <>
                  {isPortfolioOwner ? (
                    <Link
                      href="/portfolio-owner/create"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      <span>Create</span>
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <User size={16} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <img
                      src={user?.avatar || '/api/placeholder/32/32'}
                      alt={user?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

      {/* Portfolio Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{portfolio.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{portfolio.description}</p>
                
                {/* Portfolio Meta */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{new Date(portfolio.createdAt).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{portfolio.views || 0} views</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart size={16} />
                    <span>{portfolio.likes || 0} likes</span>
                  </span>
                  {portfolio.featured && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {portfolio.tags && portfolio.tags.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap gap-2">
                {portfolio.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={portfolio.owner.avatar || '/default-avatar.svg'}
                  alt={portfolio.owner.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {portfolio.owner.firstName || portfolio.owner.username}
                  </h3>
                  <p className="text-sm text-gray-600">@{portfolio.owner.username}</p>
                </div>
              </div>
              <Link
                href={`/browse?user=${portfolio.owner.username}`}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <User size={16} />
                <span>View Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Images */}
        {portfolio.images && portfolio.images.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Gallery</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.images.map((image: string, index: number) => (
                  <div key={index} className="aspect-w-16 aspect-h-9">
                    <img
                      src={image}
                      alt={`${portfolio.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Content */}
        {portfolio.content && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">About This Project</h2>
            </div>
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{portfolio.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact/Inquiry Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageCircle size={20} />
              <span>Get in Touch</span>
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Interested in this project? Send a message to the portfolio owner.
            </p>
            <div className="flex space-x-4">
              <Link
                href={`/contact?portfolio=${portfolioId}`}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <MessageCircle size={16} />
                <span>Send Message</span>
              </Link>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const email = portfolio.owner.username;
                    const subject = `Inquiry about your portfolio: ${portfolio.title}`;
                    const body = `Hi ${portfolio.owner.firstName || portfolio.owner.username},\n\nI'm interested in your portfolio titled "${portfolio.title}".\n\n[Add your message here]\n\nBest regards,\n[Your name]`;
                    
                    const mailtoLink = `mailto:${email}@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailtoLink;
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Mail size={16} />
                <span>Email Directly</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
