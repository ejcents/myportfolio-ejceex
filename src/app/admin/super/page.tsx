"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LogOut, Users, Key, ArrowLeft, Eye, EyeOff, Check, X, Clock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";

export default function SuperAdminPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, login, logout, resetAdminPassword } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactRequests, setContactRequests] = useState<any[]>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Redirect non-super-admin users
  useEffect(() => {
    if (isAuthenticated && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isSuperAdmin, router]);

  // Load contact requests when authenticated
  useEffect(() => {
    if (isAuthenticated && isSuperAdmin) {
      const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
      console.log('Super-admin: Loading contact requests:', requests);
      setContactRequests(requests);
    }
  }, [isAuthenticated, isSuperAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === "super123") {
      login('superadmin');
      setPassword("");
      addToast('success', 'Logged in as Super Admin');
    } else {
      addToast('error', 'Incorrect super-admin password');
    }
  };

  const handleLogout = () => {
    logout();
    setPassword("");
  };

  const handleApproveRequest = (requestId: string) => {
    console.log('Super-admin: Approving request:', requestId);
    const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
    const updatedRequests = requests.map((req: any) => 
      req.id === requestId ? { ...req, status: 'approved', approvedAt: new Date().toISOString() } : req
    );
    localStorage.setItem('contactRequests', JSON.stringify(updatedRequests));
    setContactRequests(updatedRequests);
    addToast('success', 'Request approved. You may now provide admin access credentials.');
  };

  const handleDenyRequest = (requestId: string) => {
    console.log('Super-admin: Denying request:', requestId);
    const requests = JSON.parse(localStorage.getItem('contactRequests') || '[]');
    const updatedRequests = requests.map((req: any) => 
      req.id === requestId ? { ...req, status: 'denied', deniedAt: new Date().toISOString() } : req
    );
    localStorage.setItem('contactRequests', JSON.stringify(updatedRequests));
    setContactRequests(updatedRequests);
    addToast('warning', 'Request denied due to insufficient verification.');
  };

  const handlePasswordReset = () => {
    if (newAdminPassword !== confirmPassword) {
      addToast('error', 'Passwords do not match');
      return;
    }
    
    if (newAdminPassword.length < 6) {
      addToast('error', 'Password must be at least 6 characters');
      return;
    }
    
    resetAdminPassword(newAdminPassword);
    addToast('success', 'Admin password reset successfully');
    setShowPasswordReset(false);
    setNewAdminPassword("");
    setConfirmPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100 p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="relative mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-sm opacity-20"></div>
              <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Shield className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Super Admin Portal</h1>
            <p className="text-slate-600">Enter super-admin credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Super Admin Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200 group-hover:bg-white"
                  placeholder="Enter super-admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-500 transition-colors p-1 rounded-lg hover:bg-purple-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Login as Super Admin
            </button>
          </form>

          <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-xs text-purple-600 mb-2">
              <strong>Default Super Admin Credentials:</strong>
            </p>
            <div className="space-y-1 text-xs text-purple-500">
              <p>• Super Admin: super123</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-sm opacity-20"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Super Admin Dashboard
                </h1>
                <p className="text-slate-500 text-xs uppercase tracking-wide">User Management System</p>
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
        {/* Admin Password Reset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Key className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Admin Password Management</h2>
                <p className="text-slate-500 text-sm">Reset or update admin credentials</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordReset(!showPasswordReset)}
              className="group px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-sm font-medium"
            >
              {showPasswordReset ? 'Cancel' : 'Reset Password'}
            </button>
          </div>

          {showPasswordReset && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-purple-100 pt-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Admin Password
                  </label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200"
                    placeholder="Enter new password"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur transition-all duration-200"
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordReset(false);
                    setNewAdminPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-4 py-2 text-slate-700 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordReset}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Reset Password
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Requests Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Contact Requests</h2>
                <p className="text-slate-500 text-sm">Review admin access requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {contactRequests.filter(req => req.status === 'pending').length} Pending
              </span>
            </div>
          </div>

          {contactRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-orange-500" size={32} />
              </div>
              <p className="text-lg font-medium text-slate-700 mb-2">No Contact Requests</p>
              <p className="text-slate-500">No admin access requests received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contactRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-purple-100 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-purple-200 bg-white/50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{request.name}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' 
                            ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200' 
                            : request.status === 'approved'
                            ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            request.status === 'pending' ? 'bg-orange-400' : 
                            request.status === 'approved' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}></div>
                          {request.status === 'pending' ? 'Pending Review' : 
                           request.status === 'approved' ? 'Approved' : 'Denied'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                        <span className="flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{request.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>{new Date(request.timestamp).toLocaleDateString()}</span>
                        </span>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-slate-700 mb-1">Reason for Access:</p>
                        <p className="text-sm text-slate-600">{request.reason}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Identity Verification:</p>
                        <p className="text-sm text-slate-600">{request.identity}</p>
                      </div>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-purple-100">
                      <button
                        onClick={() => handleDenyRequest(request.id)}
                        className="group flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-lg hover:from-red-100 hover:to-pink-100 transition-all duration-200 text-sm font-medium"
                      >
                        <X size={14} className="group-hover:scale-110 transition-transform" />
                        <span>Deny Request</span>
                      </button>
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="group flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-all duration-200 text-sm font-medium"
                      >
                        <Check size={14} className="group-hover:scale-110 transition-transform" />
                        <span>Approve Request</span>
                      </button>
                    </div>
                  )}
                  
                  {request.status === 'approved' && (
                    <div className="mt-4 pt-4 border-t border-emerald-100">
                      <p className="text-sm text-emerald-700">
                        <strong>Approved on:</strong> {new Date(request.approvedAt).toLocaleDateString()} at {new Date(request.approvedAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">You may now provide admin credentials to this user.</p>
                    </div>
                  )}
                  
                  {request.status === 'denied' && (
                    <div className="mt-4 pt-4 border-t border-red-100">
                      <p className="text-sm text-red-700">
                        <strong>Denied on:</strong> {new Date(request.deniedAt).toLocaleDateString()} at {new Date(request.deniedAt).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-red-600 mt-1">Request denied due to insufficient verification.</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-purple-100 shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">User Accounts</h2>
                <p className="text-slate-500 text-sm">Manage system users and permissions</p>
              </div>
            </div>
          </div>

          <div className="text-center py-16 text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold text-slate-700 mb-2">User Management</p>
            <p className="text-slate-500">User management features coming soon</p>
          </div>
        </motion.div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
