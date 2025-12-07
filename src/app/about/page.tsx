"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserAuth } from '@/contexts/UserAuthContext';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Users, Eye, Briefcase, Heart, ArrowRight, Star, Shield, Zap, Globe, Plus, LogIn, UserPlus, User } from 'lucide-react';

export default function About() {
  const { user, isAuthenticated, isPortfolioOwner } = useUserAuth();
  const [stats, setStats] = useState([
    { icon: Users, value: 0, target: 1000, label: 'Active Creators', suffix: '+' },
    { icon: Eye, value: 0, target: 5000, label: 'Portfolio Views', suffix: '+' },
    { icon: Briefcase, value: 0, target: 50, label: 'Creative Categories', suffix: '+' },
    { icon: Heart, value: 0, target: 99, label: 'User Satisfaction', suffix: '%' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: Math.min(stat.value + Math.ceil(stat.target / 50), stat.target)
        }))
      );
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your creative work is protected with enterprise-grade security'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures your portfolios load instantly'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with opportunities and clients from around the world'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              About PortfolioHub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The premier platform where creative professionals showcase their work and connect with opportunities that matter.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Explore Portfolios</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <stat.icon size={24} className="text-blue-600" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                We believe every creative professional deserves a beautiful digital space to showcase their work and tell their story.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                PortfolioHub empowers creators to build stunning portfolios that impress potential clients, employers, and collaborators worldwide.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold">Thousands</span> of creators trust PortfolioHub
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Star className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-3xl font-bold">4.9</div>
                    <div className="text-blue-100">User Rating</div>
                  </div>
                  <div className="text-center">
                    <Zap className="w-12 h-12 mx-auto mb-2" />
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-blue-100">Uptime</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PortfolioHub?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with creators in mind, featuring the tools and features you need to succeed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Showcase Your Work?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creative professionals using PortfolioHub to grow their careers and connect with opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/browse"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <span>Browse Examples</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

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
