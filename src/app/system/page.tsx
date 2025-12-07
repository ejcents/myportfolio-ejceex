"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LogOut, Settings, MessageSquare, BarChart3, User, Bell, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";

interface SystemMessage {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'system_update' | 'security_alert' | 'user_request' | 'maintenance' | 'general';
}

export default function SystemPage() {
  const router = useRouter();
  const { isAuthenticated, role, login, logout } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [messages, setMessages] = useState<SystemMessage[]>([
    {
      id: '1',
      sender: 'System Administrator',
      recipient: 'Super Admin',
      subject: 'System Performance Report',
      content: 'Monthly system performance analysis shows 99.9% uptime with optimal resource utilization.',
      timestamp: '2024-12-06T09:30:00Z',
      status: 'delivered',
      priority: 'medium',
      type: 'system_update'
    },
    {
      id: '2',
      sender: 'Super Admin',
      recipient: 'System Administrator',
      subject: 'Security Audit Scheduled',
      content: 'Quarterly security audit will be conducted this Friday. Please ensure all systems are prepared.',
      timestamp: '2024-12-05T14:15:00Z',
      status: 'read',
      priority: 'high',
      type: 'security_alert'
    }
  ]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'systemadmin123') {
      const success = await login(password);
      if (success) {
        setPassword('');
        addToast('success', 'Logged in as System Administrator');
      } else {
        addToast('error', 'Login failed');
      }
    } else {
      addToast('error', 'Invalid System Administrator password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    logout();
    setPassword('');
    addToast('success', 'Logged out successfully');
  };

  // Simple authentication check - only check if authenticated and role is systemadmin
  if (!isAuthenticated || role !== 'systemadmin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">System Administrator</h1>
              <p className="text-slate-600">Enter your system credentials</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">System Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    placeholder="Enter system password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Access System
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500">
                System Administrator Portal
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
           <Settings className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">System Administrator</h1>
                  <p className="text-xs text-slate-500">System Management Portal</p>
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
                onClick={() => router.push('/system')}
                className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
              >
                <Settings size={16} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => router.push('/system/messages')}
                className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
              >
                <MessageSquare size={16} />
                <span>Messages</span>
              </button>
              <button
                onClick={() => router.push('/system/profile')}
                className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
              >
                <User size={16} />
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
                value: messages.length,
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
                title: 'System Alerts',
                value: '2',
                icon: Bell,
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
                  <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                </div>
                <h3 className="text-slate-700 font-medium">{stat.title}</h3>
              </motion.div>
            ))}
          </div>

          {/* Recent Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <MessageSquare className="text-blue-500 mr-2" size={24} />
              Recent Communications
            </h3>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-900">{message.sender}</span>
                      <span className="text-slate-500">→</span>
                      <span className="font-medium text-blue-600">{message.recipient}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      message.priority === 'high' ? 'bg-red-100 text-red-700' :
                      message.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {message.priority}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{message.subject}</h4>
                  <p className="text-slate-600 text-sm mb-2">{message.content}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                    <span className="capitalize">{message.status}</span>
                  </div>
                </div>
              ))}
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