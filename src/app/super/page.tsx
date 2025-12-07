"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LogOut, Users, Eye, EyeOff, Settings, MessageSquare, User, Activity, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";

export default function SuperAdminPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, login, logout } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  
  // Mock messages for stats
  const [messages] = useState([
    { id: '1', recipient: 'Super Admin', status: 'delivered' },
    { id: '2', recipient: 'Super Admin', status: 'read' },
    { id: '3', recipient: 'System Admin', status: 'sent' }
  ]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Clear password field and reset show password when user is not authenticated (on login page)
  useEffect(() => {
    if (!isAuthenticated) {
      setPassword('');
      setShowPassword(false);
    }
  }, [isAuthenticated]);

  // Redirect non-super-admin users (but allow system admins)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/super');
    } else if (isAuthenticated && role !== 'superadmin' && role !== 'systemadmin') {
      router.push('/admin');
    }
  }, [isAuthenticated, role, router]);

  const handleLogout = () => {
    logout();
    router.push('/super');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "superadmin123") {
      const success = await login('superadmin123');
      if (success) {
        setPassword("");
        addToast('success', 'Logged in as Super Admin');
      } else {
        addToast('error', 'Login failed');
      }
    } else {
      addToast('error', 'Incorrect super-admin password');
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Super Admin Portal</h1>
              <p className="text-slate-600">Enter super-admin credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Super Admin Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    placeholder="Enter super admin password"
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
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Access Super Admin
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">
                Super Admin Management Portal
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Super Admin</h1>
                <p className="text-xs text-slate-500">Super Admin Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => router.push('/super')}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/super/messages')}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
            >
              <MessageSquare size={16} />
              <span>Messages</span>
            </button>
            <button
              onClick={() => router.push('/super/users')}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
            >
              <User size={16} />
              <span>Users</span>
            </button>
            <button
              onClick={() => router.push('/super/profile')}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
            >
              <Shield size={16} />
              <span>Profile</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'System Status',
              value: 'Online',
              icon: Activity,
              color: 'from-green-500 to-emerald-500'
            },
            {
              title: 'Active Messages',
              value: messages.filter(m => m.recipient === 'Super Admin' && m.status !== 'read').length,
              icon: MessageSquare,
              color: 'from-blue-500 to-cyan-500'
            },
            {
              title: 'Security Level',
              value: 'High',
              icon: Shield,
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Admin Users',
              value: '3',
              icon: Users,
              color: 'from-orange-500 to-red-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                </div>
              </div>
            </motion.div>
          ))}

        </div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-8"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Welcome, Super Admin</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              You have full access to the system administration panel. Monitor and manage all aspects of the system from this central dashboard.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
      
    <div className="mt-12">
      <AdminFooter />
    </div>
    </>
  );
}
