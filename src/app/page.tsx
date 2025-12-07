"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Eye, Grid, List, SlidersHorizontal, Plus } from 'lucide-react';
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

export default function Home() {
  const { user, isAuthenticated, isPortfolioOwner } = useUserAuth();
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch real portfolio posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/portfolios');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch portfolios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = ['all', 'Web Design', 'Branding', 'Mobile', 'Illustration', 'Photography', '3D Design'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory && post.published;
  });

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

      {/* Filters and Controls */}
      <section className="bg-white/60 backdrop-blur-sm border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <Filter size={20} className="text-blue-600" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">
                  {filteredPosts.length} portfolios found
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-6'
        }>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
            >
              <Link href={`/portfolio/${post.id}`}>
                <div className={viewMode === 'grid' ? '' : 'flex'}>
                  {/* Image */}
                  <div className={viewMode === 'grid' ? 'relative h-56' : 'w-48 h-32 flex-shrink-0'}>
                    <img
                      src={post.images[0] || '/api/placeholder/400/300'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {post.featured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={viewMode === 'grid' ? 'p-6' : 'flex-1 p-4'}>
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={post.owner.avatar || '/api/placeholder/24/24'}
                        alt={post.owner.username}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      />
                      <span className="text-sm font-medium text-gray-700">@{post.owner.username}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                          <span className="text-sm font-medium">{post.views}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
                          <Heart size={16} />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {new Date(post.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {isAuthenticated && isPortfolioOwner ? (
                <Plus size={40} className="text-blue-600" />
              ) : (
                <Search size={40} className="text-blue-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {isAuthenticated && isPortfolioOwner 
                ? "No portfolios yet" 
                : "No portfolios found"
              }
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {isAuthenticated && isPortfolioOwner 
                ? "Be the first to showcase your creative work and inspire others!"
                : "Try adjusting your search or filters to discover amazing portfolios"
              }
            </p>
            {isAuthenticated && isPortfolioOwner && (
              <Link
                href="/portfolio-owner/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Plus size={18} />
                <span>Create Your First Portfolio</span>
              </Link>
            )}
          </div>
        )}
      </main>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About PortfolioHub</h2>
            <p className="text-lg text-gray-600">
              The premier platform for creative professionals to showcase their work
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600 mb-4">
                We provide creative professionals with a powerful, elegant platform to showcase their work and connect with opportunities that matter.
              </p>
              <p className="text-lg text-gray-600">
                Every creative deserves a beautiful digital space to tell their story and impress potential clients, employers, and collaborators.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Global Platform</h4>
              <p className="text-gray-600">Connecting creators worldwide with opportunities that transcend borders</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
              <div className="text-gray-600">Portfolio Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Creative Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-gray-600">User Satisfaction</div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of creative professionals using PortfolioHub to grow their careers
            </p>
            <Link
              href="/auth/register"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PH</span>
              </div>
              <span className="text-2xl font-bold">PortfolioHub</span>
            </div>
            <p className="text-gray-300">&copy; 2024 PortfolioHub. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-2">Showcasing creativity, inspiring connections</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
