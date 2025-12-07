"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Eye, Grid, List, SlidersHorizontal } from 'lucide-react';
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

export default function Browse() {
  const { user, isAuthenticated, isPortfolioOwner } = useUserAuth();
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'likes', label: 'Most Liked' }
  ];

  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory && post.published;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
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

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Browse Portfolios
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100"
          >
            Discover creative work from talented portfolio owners
          </motion.p>
        </div>
      </div>

      {/* Filters and Controls */}
      <section className="bg-white/60 backdrop-blur-sm border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <Search className="text-blue-600" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search portfolios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            {/* Filters */}
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
                  {filteredAndSortedPosts.length} portfolios found
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <SlidersHorizontal size={20} className="text-purple-600" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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

          {/* Results count */}
          <div className="mt-3">
            <span className="text-sm text-gray-500">
              {filteredAndSortedPosts.length} portfolios found
            </span>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-6'
        }>
          {filteredAndSortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <Link href={`/portfolio/${post.id}`}>
                <div className={viewMode === 'grid' ? '' : 'flex'}>
                  {/* Image */}
                  <div className={viewMode === 'grid' ? 'relative h-48' : 'w-48 h-32 flex-shrink-0'}>
                    <img
                      src={post.images[0] || '/api/placeholder/400/300'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={viewMode === 'grid' ? 'p-4' : 'flex-1 p-4'}>
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={post.owner.avatar || '/api/placeholder/24/24'}
                        alt={post.owner.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">@{post.owner.username}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{post.likes}</span>
                        </span>
                      </div>
                      <span className="text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            {isAuthenticated && isPortfolioOwner && (
              <Link
                href="/portfolio-owner/create"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Create Your First Portfolio</span>
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
