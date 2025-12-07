"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, User, Mail, MessageSquare } from 'lucide-react';

function ContactPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get('portfolio');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    if (portfolioId) {
      fetchPortfolio();
    }
  }, [portfolioId]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
        setFormData(prev => ({
          ...prev,
          subject: `Inquiry about your portfolio: ${data.title}`
        }));
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          portfolioId: portfolioId || undefined
        }),
      });

      if (response.ok) {
        setMessage('Message sent successfully! The portfolio owner will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage('An error occurred while sending your message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href={portfolioId ? `/portfolio/${portfolioId}` : "/browse"}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>{portfolioId ? 'Back to Portfolio' : 'Back to Browse'}</span>
              </Link>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>/</span>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Home
                </Link>
                <span>/</span>
                <Link
                  href="/featured"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Featured
                </Link>
                <span>/</span>
                <Link
                  href="/browse"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Browse
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Contact</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 ml-4">Contact</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {portfolio && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">
                  Contacting about: {portfolio.title}
                </h3>
                <p className="text-sm text-blue-700">
                  Your message will be sent to {portfolio.owner.firstName || portfolio.owner.username}
                </p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageSquare size={20} />
              <span>Send a Message</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill out the form below and we'll deliver your message to the portfolio owner.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell the portfolio owner about your interest, project ideas, or questions..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href={portfolioId ? `/portfolio/${portfolioId}` : "/browse"}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={16} />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Alternative Contact Methods */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Mail size={20} />
              <span>Other Ways to Connect</span>
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              You can also reach out through these methods:
            </p>
            <div className="space-y-3">
              {portfolio && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Email: {portfolio.owner.username}@example.com
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-500">
                <p>• Response time: Typically within 24-48 hours</p>
                <p>• Include detailed project information for faster responses</p>
                <p>• Mention the specific portfolio you're interested in</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  );
}
