"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side before using window.history
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={16} />
            <span>Go Home</span>
          </Link>
          
          <Link
            href="/browse"
            className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search size={16} />
            <span>Browse Portfolios</span>
          </Link>

          {isClient && (
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you think this is an error, please{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700">
              contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
