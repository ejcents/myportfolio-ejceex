"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Settings, LogOut, Save, Eye, EyeOff, Lock, Key, AlertCircle, CheckCircle, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";

export default function SystemProfilePage() {
  const router = useRouter();
  const { isAuthenticated, role, profile, logout, updateProfile } = useAdminAuth();
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [editedProfile, setEditedProfile] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    title: profile?.title || '',
    bio: profile?.bio || ''
  });

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleLogout = () => {
    logout();
    router.push('/system');
  };

  const handleEditProfile = () => {
    setEditedProfile({
      name: profile?.name || '',
      email: profile?.email || '',
      title: profile?.title || '',
      bio: profile?.bio || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
    addToast('success', 'Profile updated successfully');
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      name: profile?.name || '',
      email: profile?.email || '',
      title: profile?.title || '',
      bio: profile?.bio || ''
    });
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (currentPassword !== 'systemadmin123') {
      addToast('error', 'Current password is incorrect');
      return;
    }

    if (newPassword.length < 6) {
      addToast('error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('error', 'New passwords do not match');
      return;
    }

    // In a real application, you would update the password in the authentication context
    addToast('success', 'Password updated successfully');
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Redirect if not authenticated or not system admin
  useEffect(() => {
    if (!isAuthenticated || role !== 'systemadmin') {
      router.push('/system');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'systemadmin') {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/system')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Back
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Profile Settings</h1>
                <p className="text-xs text-slate-500">Manage your system administrator profile</p>
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
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
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
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
            >
              <User size={16} />
              <span>Profile</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={40} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{profile?.name}</h2>
                <p className="text-slate-600 mb-4">{profile?.title}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                  <Shield className="text-blue-500" size={16} />
                  <span>System Administrator</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="text-slate-400" size={16} />
                    <span className="text-slate-600">{profile?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Key className="text-slate-400" size={16} />
                    <span className="text-slate-600">systemadmin123</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Lock size={16} />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={handleEditProfile}
                  className="w-full px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Settings size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {/* Profile Information */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <User className="text-blue-500 mr-2" size={20} />
                Profile Information
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editedProfile.title}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur resize-none"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Full Name</h4>
                    <p className="text-slate-900">{profile?.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Email</h4>
                    <p className="text-slate-900">{profile?.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Title</h4>
                    <p className="text-slate-900">{profile?.title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-1">Bio</h4>
                    <p className="text-slate-900">{profile?.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Password Change Form */}
            {showPasswordForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                  <Lock className="text-blue-500 mr-2" size={20} />
                  Change Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Update Password</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* System Information */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6 mt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <Shield className="text-blue-500 mr-2" size={20} />
                System Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Role</h4>
                  <p className="text-slate-900">System Administrator</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Access Level</h4>
                  <p className="text-slate-900">Full System Access</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Account Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-900">Active</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-1">Last Login</h4>
                  <p className="text-slate-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
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
