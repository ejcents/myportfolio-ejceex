"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, Mail, MapPin, Calendar, Briefcase, Edit2, Check, MessageSquare, Clock, CheckCircle, AlertCircle, Settings, BarChart3, Users, FileText, ArrowRight, Activity, TrendingUp, Shield, Bell, Mailbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";
import AdminLayout from "@/components/AdminLayout";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, currentAdminId, login, resetAdminPassword, resetSuperAdminPassword, permissions } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Redirect authenticated users to their appropriate pages
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'superadmin') {
        router.push('/super');
      } else if (role === 'systemadmin') {
        router.push('/system');
      }
      // Regular admins stay on admin page
    }
  }, [isAuthenticated, role, router]);

  // Clear password field and reset show password when user is not authenticated (on login page)
  useEffect(() => {
    if (!isAuthenticated) {
      setPassword('');
      setShowPassword(false);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(password);
    
    if (!success) {
      addToast('error', 'Invalid password');
      setPassword('');
    } else {
      // The useEffect will handle the redirect based on the role
      addToast('success', 'Login successful');
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h1>
              <p className="text-slate-600">Enter admin password to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-black placeholder-gray-500"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Welcome Admin!" 
      currentPage="/admin"
    >
      {/* Debug Info */}
      {/* <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
        <p><strong>Current Permissions:</strong></p>
        <pre>{JSON.stringify(permissions, null, 2)}</pre>
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Bell className="text-amber-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FileText className="text-emerald-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">Active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permissions?.canViewMessages && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/messages')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Messages</h3>
                <p className="text-sm text-gray-600">View and manage contact messages</p>
                {!permissions?.canEditMessages && (
                  <p className="text-xs text-amber-600 mt-1">View only</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {permissions?.canViewPortfolio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/portfolio')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FileText className="text-emerald-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Portfolio</h3>
                <p className="text-sm text-gray-600">Manage portfolio items and projects</p>
                {!permissions?.canEditPortfolio && (
                  <p className="text-xs text-amber-600 mt-1">View only</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {permissions?.canViewAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push('/admin/analytics')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View site statistics and insights</p>
              </div>
            </div>
          </motion.div>
        )}

        {!permissions?.canViewMessages && !permissions?.canViewPortfolio && !permissions?.canViewAnalytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="text-center">
              <p className="text-gray-500">Limited access</p>
              <p className="text-sm text-gray-400 mt-1">You have restricted permissions. Contact your administrator for access.</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Admin Footer with spacing */}
      <div className="mt-12">
        <AdminFooter />
      </div>
    </AdminLayout>
  );
}
