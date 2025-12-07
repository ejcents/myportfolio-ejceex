"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Activity, Shield, Calendar, Download, Filter, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminLayout from "@/components/AdminLayout";
import AdminFooter from "@/components/AdminFooter";

export default function SuperAdminAnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, logout } = useAdminAuth();
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push('/super');
  };

  // Redirect non-super-admin users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/super');
    } else if (isAuthenticated && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isSuperAdmin, router]);

  const analyticsData = {
    overview: {
      totalAdmins: 1,
      activeUsers: 24,
      systemUptime: '99.9%',
      securityScore: 95,
      lastBackup: '2024-12-06T02:00:00Z'
    },
    systemMetrics: [
      { name: 'CPU Usage', value: 45, status: 'normal' },
      { name: 'Memory Usage', value: 62, status: 'normal' },
      { name: 'Disk Space', value: 78, status: 'warning' },
      { name: 'Network Traffic', value: 34, status: 'normal' }
    ],
    userActivity: [
      { date: '2024-12-01', logins: 45, pageViews: 234 },
      { date: '2024-12-02', logins: 52, pageViews: 289 },
      { date: '2024-12-03', logins: 38, pageViews: 198 },
      { date: '2024-12-04', logins: 61, pageViews: 312 },
      { date: '2024-12-05', logins: 49, pageViews: 267 },
      { date: '2024-12-06', logins: 57, pageViews: 298 }
    ],
    securityEvents: [
      { type: 'Login Attempts', count: 124, status: 'normal' },
      { type: 'Failed Logins', count: 8, status: 'warning' },
      { type: 'Password Changes', count: 3, status: 'normal' },
      { type: 'Security Scans', count: 24, status: 'normal' }
    ]
  };

  if (!isAuthenticated || !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <AdminLayout 
          title="Super Admin Analytics" 
          subtitle="System-wide analytics and performance metrics" 
          currentPage="/super/analytics"
        >
          <div className="max-w-7xl mx-auto">
            {/* Time Range Selector */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-slate-900">Analytics Overview</h2>
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-slate-400" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <Download size={16} />
                <span>Export Report</span>
              </button>
            </motion.div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: 'Total Admins',
                  value: analyticsData.overview.totalAdmins,
                  icon: Users,
                  color: 'from-purple-500 to-pink-500',
                  change: '+0%'
                },
                {
                  title: 'Active Users',
                  value: analyticsData.overview.activeUsers,
                  icon: Activity,
                  color: 'from-blue-500 to-cyan-500',
                  change: '+12%'
                },
                {
                  title: 'System Uptime',
                  value: analyticsData.overview.systemUptime,
                  icon: TrendingUp,
                  color: 'from-green-500 to-emerald-500',
                  change: 'Stable'
                },
                {
                  title: 'Security Score',
                  value: `${analyticsData.overview.securityScore}%`,
                  icon: Shield,
                  color: 'from-orange-500 to-red-500',
                  change: '+2%'
                }
              ].map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                      <metric.icon className="text-white" size={20} />
                    </div>
                    <span className={`text-sm font-medium ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-slate-600'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</h3>
                  <p className="text-slate-600 text-sm">{metric.title}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* System Metrics */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">System Metrics</h3>
                  <BarChart3 className="text-purple-500" size={24} />
                </div>
                <div className="space-y-4">
                  {analyticsData.systemMetrics.map((metric, index) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                        <span className={`text-sm font-medium ${
                          metric.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            metric.status === 'normal' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Security Events */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Security Events</h3>
                  <Shield className="text-purple-500" size={24} />
                </div>
                <div className="space-y-4">
                  {analyticsData.securityEvents.map((event, index) => (
                    <div key={event.type} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <div>
                        <p className="font-medium text-slate-900">{event.type}</p>
                        <p className="text-sm text-slate-600">Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          event.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {event.count}
                        </p>
                        <p className="text-xs text-slate-500">{event.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* User Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">User Activity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-sm text-slate-600">Logins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full" />
                    <span className="text-sm text-slate-600">Page Views</span>
                  </div>
                </div>
              </div>
              
              {/* Simple Chart Representation */}
              <div className="space-y-4">
                {analyticsData.userActivity.map((day, index) => (
                  <div key={day.date} className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600 w-20">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 flex space-x-2">
                      <div className="flex-1 bg-purple-100 rounded-lg relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-purple-500 rounded-lg transition-all duration-500"
                          style={{ width: `${(day.logins / 100) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-700">
                          {day.logins}
                        </span>
                      </div>
                      <div className="flex-1 bg-pink-100 rounded-lg relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-pink-500 rounded-lg transition-all duration-500"
                          style={{ width: `${(day.pageViews / 400) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-700">
                          {day.pageViews}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </AdminLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <AdminLayout 
        title="Super Admin Analytics" 
        subtitle="System-wide analytics and performance metrics" 
        currentPage="/super/analytics"
      >
        <div className="max-w-7xl mx-auto">
        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-slate-900">Analytics Overview</h2>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-slate-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Admins',
              value: analyticsData.overview.totalAdmins,
              icon: Users,
              color: 'from-purple-500 to-pink-500',
              change: '+0%'
            },
            {
              title: 'Active Users',
              value: analyticsData.overview.activeUsers,
              icon: Activity,
              color: 'from-blue-500 to-cyan-500',
              change: '+12%'
            },
            {
              title: 'System Uptime',
              value: analyticsData.overview.systemUptime,
              icon: TrendingUp,
              color: 'from-green-500 to-emerald-500',
              change: 'Stable'
            },
            {
              title: 'Security Score',
              value: `${analyticsData.overview.securityScore}%`,
              icon: Shield,
              color: 'from-orange-500 to-red-500',
              change: '+2%'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                  <metric.icon className="text-white" size={20} />
                </div>
                <span className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-green-600' : 'text-slate-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</h3>
              <p className="text-slate-600 text-sm">{metric.title}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* System Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">System Metrics</h3>
              <BarChart3 className="text-purple-500" size={24} />
            </div>
            <div className="space-y-4">
              {analyticsData.systemMetrics.map((metric, index) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                    <span className={`text-sm font-medium ${
                      metric.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {metric.value}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.status === 'normal' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Security Events</h3>
              <Shield className="text-purple-500" size={24} />
            </div>
            <div className="space-y-4">
              {analyticsData.securityEvents.map((event, index) => (
                <div key={event.type} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div>
                    <p className="font-medium text-slate-900">{event.type}</p>
                    <p className="text-sm text-slate-600">Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      event.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {event.count}
                    </p>
                    <p className="text-xs text-slate-500">{event.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* User Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">User Activity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <span className="text-sm text-slate-600">Logins</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full" />
                <span className="text-sm text-slate-600">Page Views</span>
              </div>
            </div>
          </div>
          
          {/* Simple Chart Representation */}
          <div className="space-y-4">
            {analyticsData.userActivity.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 w-20">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1 flex space-x-2">
                  <div className="flex-1 bg-purple-100 rounded-lg relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-purple-500 rounded-lg transition-all duration-500"
                      style={{ width: `${(day.logins / 100) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-700">
                      {day.logins}
                    </span>
                  </div>
                  <div className="flex-1 bg-pink-100 rounded-lg relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-pink-500 rounded-lg transition-all duration-500"
                      style={{ width: `${(day.pageViews / 400) * 100}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-700">
                      {day.pageViews}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">System Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Last Backup</span>
                <span className="text-sm font-medium text-slate-900">
                  {new Date(analyticsData.overview.lastBackup).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">System Version</span>
                <span className="text-sm font-medium text-slate-900">v2.1.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Database Status</span>
                <span className="text-sm font-medium text-green-600">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">API Status</span>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <Eye size={16} />
                <span>View Detailed Reports</span>
              </button>
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Download size={16} />
                <span>Download Analytics</span>
              </button>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <Shield size={16} />
                <span>Security Audit</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Toast Container */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </AdminLayout>
      
      {/* Footer with proper spacing - outside AdminLayout */}
      <div className="mt-12">
        <AdminFooter />
      </div>
    </div>
  );
}
