"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Eye, User, Crown, TrendingUp, Award } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface PortfolioPost {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  category: string;
  featured: boolean;
  published: boolean;
  views: number;
  likes: number;
  createdAt: string;
  owner: {
    username: string;
    avatar?: string;
  };
}

export default function Featured() {
  const { user, isAuthenticated, isPortfolioOwner } = useUserAuth();
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch('/api/portfolios/featured');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch featured portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <Crown className="text-white" size={40} />
              </div>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Featured Portfolios
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-yellow-100 max-w-2xl mx-auto"
          >
            Discover the most exceptional creative work selected by our community
          </motion.p>
        </div>
      </div>

      {/* Featured Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length > 0 ? (
          <>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
            >
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                <div className="text-sm text-gray-600">Featured Works</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {posts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {posts.reduce((sum, post) => sum + post.likes, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(posts.map(post => post.owner.username)).size}
                </div>
                <div className="text-sm text-gray-600">Featured Artists</div>
              </div>
            </motion.div>

            {/* Featured Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/portfolio/${post.id}`}>
                    <div className="relative">
                      {/* Image */}
                      <div className="h-64 bg-gray-200">
                        <img
                          src={post.images[0] || '/api/placeholder/600/400'}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Featured Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star size={14} />
                        <span>Featured</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Owner Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={post.owner.avatar || '/api/placeholder/40/40'}
                          alt={post.owner.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900">@{post.owner.username}</div>
                          <div className="text-sm text-gray-500">{post.category}</div>
                        </div>
                      </div>
                      
                      {/* Title and Description */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Eye size={16} />
                            <span>{post.views.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart size={16} />
                            <span>{post.likes.toLocaleString()}</span>
                          </span>
                        </div>
                        <span className="text-xs">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Crown size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Featured Portfolios Yet</h3>
            <p className="text-gray-500 mb-6">
              Featured portfolios will appear here once they are selected by our team
            </p>
            {isAuthenticated && isPortfolioOwner && (
              <Link
                href="/portfolio-owner/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <span>Create Outstanding Portfolio</span>
              </Link>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2024 PortfolioHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
