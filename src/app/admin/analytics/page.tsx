"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Clock,
  Calendar,
  ArrowLeft,
  BarChart,
  PieChart,
  Activity
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";
import AdminLayout from "@/components/AdminLayout";

interface AnalyticsData {
  visitors: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
    growth: number;
  };
  messages: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    unread: number;
    responseRate: number;
  };
  portfolio: {
    projects: number;
    views: number;
    featuredViews: number;
    avgTimeOnPage: number;
  };
  performance: {
    uptime: number;
    loadTime: number;
    bounceRate: number;
    pagesPerSession: number;
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    visitors: {
      total: 1248,
      monthly: 342,
      weekly: 87,
      daily: 12,
      growth: 15.3
    },
    messages: {
      total: 156,
      thisMonth: 23,
      thisWeek: 8,
      unread: 5,
      responseRate: 94.2
    },
    portfolio: {
      projects: 6,
      views: 892,
      featuredViews: 567,
      avgTimeOnPage: 3.2
    },
    performance: {
      uptime: 99.8,
      loadTime: 1.2,
      bounceRate: 32.5,
      pagesPerSession: 2.8
    }
  });
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const mockChartData = {
    week: [12, 19, 15, 25, 22, 30, 28],
    month: [65, 78, 90, 81, 95, 88, 102, 98, 112, 108, 95, 87],
    year: [320, 380, 420, 390, 450, 480, 510, 490, 520, 495, 530, 580]
  };

  const mockMessageData = [
    { month: 'Jan', messages: 12 },
    { month: 'Feb', messages: 18 },
    { month: 'Mar', messages: 15 },
    { month: 'Apr', messages: 22 },
    { month: 'May', messages: 19 },
    { month: 'Jun', messages: 23 }
  ];

  const deviceData = [
    { name: 'Desktop', value: 65, color: 'from-blue-500 to-blue-600' },
    { name: 'Mobile', value: 28, color: 'from-green-500 to-green-600' },
    { name: 'Tablet', value: 7, color: 'from-purple-500 to-purple-600' }
  ];

  const projectViews = [
    { name: 'E-Commerce', views: 234 },
    { name: 'Task Manager', views: 189 },
    { name: 'Weather Dashboard', views: 156 },
    { name: 'Social Media Analytics', views: 145 },
    { name: 'Portfolio Website', views: 98 },
    { name: 'Chat App', views: 70 }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout 
      title="Analytics" 
      subtitle="View site performance and visitor statistics" 
      currentPage="/admin/analytics"
    >
      <div className="max-w-7xl mx-auto">
        {/* Time Range Selector */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                analyticsData.visitors.growth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {analyticsData.visitors.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{Math.abs(analyticsData.visitors.growth)}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">{analyticsData.visitors.total.toLocaleString()}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Visitors</p>
              <p className="text-sm text-slate-600 mt-1">{analyticsData.visitors.monthly} this month</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="text-white" size={24} />
              </div>
              <div className="text-sm text-green-600 flex items-center space-x-1">
                <TrendingUp size={16} />
                <span>{analyticsData.messages.responseRate}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">{analyticsData.messages.total}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Messages</p>
              <p className="text-sm text-slate-600 mt-1">{analyticsData.messages.unread} unread</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="text-white" size={24} />
              </div>
              <div className="text-sm text-green-600 flex items-center space-x-1">
                <TrendingUp size={16} />
                <span>12%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">{analyticsData.portfolio.views.toLocaleString()}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Portfolio Views</p>
              <p className="text-sm text-slate-600 mt-1">{analyticsData.portfolio.projects} projects</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div className="text-sm text-green-600 flex items-center space-x-1">
                <span>{analyticsData.performance.uptime}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-900">{analyticsData.performance.loadTime}s</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Load Time</p>
              <p className="text-sm text-slate-600 mt-1">{analyticsData.performance.bounceRate}% bounce</p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Visitor Chart */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Visitor Trends</h2>
                  <p className="text-slate-500 text-sm">Website traffic over time</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Calendar size={16} />
                  <span>Last {timeRange}</span>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {mockChartData[timeRange].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / Math.max(...mockChartData[timeRange])) * 100}%` }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-1 bg-gradient-to-t from-indigo-500 to-cyan-500 rounded-t-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200"
                  >
                    <div className="text-xs text-white font-medium text-center pt-2">{value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Messages Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Message Analytics</h2>
                  <p className="text-slate-500 text-sm">Contact form submissions over time</p>
                </div>
              </div>
              <div className="space-y-4">
                {mockMessageData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-slate-600">{data.month}</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-8 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.messages / Math.max(...mockMessageData.map(d => d.messages))) * 100}%` }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-8 rounded-full flex items-center justify-end pr-3"
                      >
                        <span className="text-white text-sm font-medium">{data.messages}</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Device Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Device Distribution</h2>
              <div className="space-y-4">
                {deviceData.map((device, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">{device.name}</span>
                      <span className="text-sm text-slate-600">{device.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${device.value}%` }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-r ${device.color} h-2 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Project Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Project Performance</h2>
              <div className="space-y-3">
                {projectViews.slice(0, 4).map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700 truncate">{project.name}</p>
                      <p className="text-xs text-slate-500">{project.views} views</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <Eye className="text-indigo-600" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Avg. Session Duration</span>
                  <span className="text-sm font-medium text-slate-900">{analyticsData.portfolio.avgTimeOnPage} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pages per Session</span>
                  <span className="text-sm font-medium text-slate-900">{analyticsData.performance.pagesPerSession}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Bounce Rate</span>
                  <span className="text-sm font-medium text-slate-900">{analyticsData.performance.bounceRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Server Uptime</span>
                  <span className="text-sm font-medium text-slate-900">{analyticsData.performance.uptime}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Admin Footer */}
      <AdminFooter />
    </AdminLayout>
  );
}
