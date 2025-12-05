"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, LogOut, User, Mail, MapPin, Calendar, Briefcase, Edit2, Check, X, MessageSquare, Clock, CheckCircle, AlertCircle, Settings, BarChart3, Users, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, login, logout, resetAdminPassword } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactRequest, setContactRequest] = useState({
    name: "",
    email: "",
    reason: "",
    identity: ""
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showContactOption, setShowContactOption] = useState(false);
  const messagesPerPage = 3;

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Debug state changes
  useEffect(() => {
    console.log('State changed:', {
      loginAttempts,
      showContactOption,
      showContactForm
    });
  }, [loginAttempts, showContactOption, showContactForm]);

  // Redirect super-admin to super-admin dashboard
  useEffect(() => {
    if (isAuthenticated && isSuperAdmin) {
      router.push('/admin/super');
    }
  }, [isAuthenticated, isSuperAdmin, router]);

  // Fetch messages when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, currentPage]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`/api/messages?page=${currentPage}&limit=${messagesPerPage}`);
      const result = await response.json();
      if (result.success) {
        setMessages(result.data.messages);
        setTotalMessages(result.data.total);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: messageId, status: newStatus }),
      });
      
      if (response.ok) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, status: newStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const totalPages = Math.ceil(totalMessages / messagesPerPage);
  const paginatedMessages = messages;

  // Handle authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check stored admin password first
    const storedAdminPassword = localStorage.getItem('adminPassword');
    
    if (password === "super123") {
      login('superadmin');
      setPassword("");
      addToast('success', 'Logged in as Super Admin');
    } else if (password === "admin123" || (storedAdminPassword && password === storedAdminPassword)) {
      login('admin');
      setPassword("");
      addToast('success', 'Logged in as Admin');
    } else {
      addToast('error', 'Incorrect password. Please try again.');
      const newAttempts = loginAttempts + 1;
      console.log('Login failed, newAttempts:', newAttempts);
      setLoginAttempts(newAttempts);
      if (newAttempts >= 3) {
        console.log('Setting showContactOption to true');
        setShowContactOption(true);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setPassword("");
  };

  const handleContactSubmit = () => {
    console.log('Contact form submitted:', contactRequest);
    if (!contactRequest.name || !contactRequest.email || !contactRequest.reason || !contactRequest.identity) {
      addToast('error', 'Please fill in all fields');
      return;
    }

    // Store contact request in localStorage for super-admin to review
    const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
    const newRequest = {
      id: Date.now().toString(),
      ...contactRequest,
      timestamp: new Date().toISOString(),
      status: 'pending',
      ipAddress: 'client-ip' // In production, get actual IP
    };
    console.log('New request created:', newRequest);
    requests.push(newRequest);
    localStorage.setItem('contactRequests', JSON.stringify(requests));
    console.log('Requests stored in localStorage:', requests);

    addToast('success', 'Your request has been sent to the Super Admin for verification');
    setShowContactForm(false);
    setContactRequest({ name: "", email: "", reason: "", identity: "" });
    setLoginAttempts(0);
    setShowContactOption(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-indigo-100 p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur-sm opacity-20"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">Admin Portal</h1>
            <p className="text-slate-600">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 group-hover:bg-white"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors p-1 rounded-lg hover:bg-indigo-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>

          {showContactOption && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800 mb-3">
                <strong>Having trouble accessing your account?</strong>
              </p>
              <button
                onClick={() => {
                  console.log('Contact button clicked');
                  console.log('showContactForm before:', showContactForm);
                  setShowContactForm(true);
                  console.log('showContactForm after:', showContactForm);
                }}
                className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
              >
                Contact Super Admin for Assistance
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 mb-2">
              <strong>Default Credentials:</strong>
            </p>
            <div className="space-y-1 text-xs text-slate-500">
              <p>• Admin: admin123</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur-sm opacity-20"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-500 text-xs uppercase tracking-wide">Portfolio Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 transition-all duration-200 rounded-lg hover:bg-slate-100"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">12</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Projects</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">Portfolio Items</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{totalMessages}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">Contact Form</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">1.2k</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Visitors</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">This Month</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">98%</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Uptime</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">Performance</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Messages</h3>
                <p className="text-indigo-100 text-sm">Manage contact messages</p>
              </div>
              <button
                onClick={() => router.push('/admin/messages')}
                className="group bg-white/20 backdrop-blur border border-white/30 rounded-xl p-3 hover:bg-white/30 transition-all duration-200"
              >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Portfolio</h3>
                <p className="text-emerald-100 text-sm">Update portfolio content</p>
              </div>
              <button
                onClick={() => router.push('/admin/portfolio')}
                className="group bg-white/20 backdrop-blur border border-white/30 rounded-xl p-3 hover:bg-white/30 transition-all duration-200"
              >
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Analytics</h3>
                <p className="text-purple-100 text-sm">View site statistics</p>
              </div>
              <button className="group bg-white/20 backdrop-blur border border-white/30 rounded-xl p-3 hover:bg-white/30 transition-all duration-200">
                <BarChart3 size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <FileText className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Portfolio Management</h2>
                    <p className="text-slate-500 text-sm">Edit and manage your portfolio content</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/admin/portfolio')}
                  className="group px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                >
                  <Edit2 size={16} className="group-hover:rotate-12 transition-transform" />
                  <span>Edit Portfolio</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="text-center py-12 text-slate-500">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-indigo-500" size={32} />
                </div>
                <p className="text-lg font-medium text-slate-700 mb-2">Portfolio Content Editor</p>
                <p className="text-slate-500">Click "Edit Portfolio" to manage your portfolio information</p>
              </div>
            </motion.div>

            {/* Contact Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <MessageSquare size={20} className="text-indigo-600" />
                  <span>Recent Messages</span>
                </h2>
                <button
                  onClick={() => router.push('/admin/messages')}
                  className="group px-4 py-2 bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 text-indigo-700 rounded-xl hover:from-indigo-100 hover:to-cyan-100 transition-all duration-200 text-sm font-medium"
                >
                  View All
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="text-indigo-500" size={32} />
                  </div>
                  <p className="text-xl font-semibold text-slate-700 mb-2">No Messages</p>
                  <p className="text-slate-500">No messages received yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border border-indigo-100 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-indigo-200 bg-white/50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-900">{message.name}</h3>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                message.status === 'unread' 
                                  ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200' 
                                  : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'
                              }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${message.status === 'unread' ? 'bg-orange-400' : 'bg-emerald-400'}`}></div>
                                {message.status === 'unread' ? 'Pending' : 'Processed'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                              <span className="flex items-center space-x-1">
                                <Mail size={14} />
                                <span>{message.email}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-800 mb-1">{message.subject}</p>
                            <p className="text-slate-600 line-clamp-2">{message.message}</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                          {message.status === 'unread' && (
                            <button
                              onClick={() => updateMessageStatus(message.id, 'read')}
                              className="group flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-all duration-200 text-sm font-medium"
                            >
                              <CheckCircle size={14} className="group-hover:scale-110 transition-transform" />
                              <span>Mark as Read</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Analytics Only */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Total Messages</span>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">{totalMessages}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Processed</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">
                    {messages.filter(m => m.status === 'read').length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {messages.filter(m => m.status === 'unread').length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/admin/messages')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <MessageSquare size={18} />
                  <span>View All Messages</span>
                </button>
                
                <button
                  onClick={() => router.push('/admin/portfolio')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <FileText size={18} />
                  <span>Edit Portfolio</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Contact Super Admin</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={contactRequest.name}
                  onChange={(e) => setContactRequest(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={contactRequest.email}
                  onChange={(e) => setContactRequest(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Access Request *
                </label>
                <textarea
                  value={contactRequest.reason}
                  onChange={(e) => setContactRequest(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 resize-none"
                  rows={3}
                  placeholder="Explain why you need admin access..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Identity Verification *
                </label>
                <textarea
                  value={contactRequest.identity}
                  onChange={(e) => setContactRequest(prev => ({ ...prev, identity: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 resize-none"
                  rows={3}
                  placeholder="Provide information to verify your identity (e.g., employee ID, project details, etc.)"
                  required
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Important:</strong> The Super Admin will verify your identity before granting access. 
                  False information will result in permanent denial of access.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowContactForm(false);
                    setContactRequest({ name: "", email: "", reason: "", identity: "" });
                  }}
                  className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContactSubmit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 font-medium"
                >
                  Send Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
