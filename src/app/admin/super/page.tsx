"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, LogOut, Users, Key, ArrowLeft, Eye, EyeOff } from "lucide-react";
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

  // Redirect non-super-admin users
  useEffect(() => {
    if (isAuthenticated && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isSuperAdmin, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting login with password:', password);
    const storedSuperAdminPassword = localStorage.getItem('superAdminPassword');
    console.log('Stored super admin password:', storedSuperAdminPassword);
    
    if (password === "superadmin123") {
      const success = await login('superadmin123');
      console.log('Login result:', success);
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

  const handleLogout = () => {
    logout();
    setPassword("");
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
                  className="w-full px-4 py-3 pr-12 border border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white/80 backdrop-blur transition-all duration-200 group-hover:bg-white placeholder-gray-500"
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

          {/* <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-xs text-purple-600 mb-2">
              <strong>Default Super Admin Credentials:</strong>
            </p>
            <div className="space-y-1 text-xs text-purple-500">
              <p>• Super Admin: superadmin123</p>
            </div>
          </div> */}
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
