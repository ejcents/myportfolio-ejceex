"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Settings, Edit, Key, Search, Filter, Plus, Trash2, CheckCircle, AlertCircle, LayoutDashboard, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";

interface AdminAccount {
  id: string;
  password: string;
  profile: {
    name: string;
    email: string;
    title: string;
    bio: string;
    avatar: string;
  };
  permissions: {
    canViewMessages: boolean;
    canEditMessages: boolean;
    canViewPortfolio: boolean;
    canEditPortfolio: boolean;
    canViewAnalytics: boolean;
    canEditProfile: boolean;
    canManageAdmins: boolean;
  };
}

export default function SuperAdminUsersPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, logout, resetSuperAdminPassword } = useAdminAuth();
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [users, setUsers] = useState<AdminAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    title: '',
    bio: ''
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
    router.push('/super');
  };

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
      const superAdminPassword = localStorage.getItem('superAdminPassword') || 'superadmin123';
      
      // Create super admin user object
      const superAdminUser: AdminAccount = {
        id: 'superadmin',
        password: superAdminPassword,
        profile: {
          name: 'Super Admin',
          email: 'superadmin@ejceex.tk',
          title: 'Super Administrator',
          bio: 'System administrator with full access to all features.',
          avatar: ''
        },
        permissions: {
          canViewMessages: true,
          canEditMessages: true,
          canViewPortfolio: true,
          canEditPortfolio: true,
          canViewAnalytics: true,
          canEditProfile: true,
          canManageAdmins: true
        }
      };

      // Create system admin user object
      const systemAdminUser: AdminAccount = {
        id: 'systemadmin',
        password: 'systemadmin123',
        profile: {
          name: 'System Administrator',
          email: 'systemadmin@ejceex.tk',
          title: 'System Administrator',
          bio: 'System administrator managing infrastructure and Super Admin communications.',
          avatar: ''
        },
        permissions: {
          canViewMessages: true,
          canEditMessages: true,
          canViewPortfolio: true,
          canEditPortfolio: true,
          canViewAnalytics: true,
          canEditProfile: true,
          canManageAdmins: false
        }
      };

      const allUsers = [superAdminUser, systemAdminUser, ...adminAccounts];
      setUsers(allUsers);
    };

    loadUsers();
  }, []);

  // Redirect non-super-admin users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/super');
    } else if (isAuthenticated && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isSuperAdmin, router]);

  const filteredUsers = users.filter(user => 
    user.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: AdminAccount) => {
    setEditingUser(user);
    setEditForm({
      name: user.profile.name,
      email: user.profile.email,
      title: user.profile.title,
      bio: user.profile.bio
    });
    setShowEditModal(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;

    const updatedUsers = users.map(user => 
      user.id === editingUser.id 
        ? { 
            ...user, 
            profile: { 
              ...user.profile, 
              ...editForm 
            }
          }
        : user
    );

    // Update localStorage
    if (editingUser.id === 'superadmin') {
      // Super admin profile is stored in auth context
      resetSuperAdminPassword(editingUser.password); // Keep same password
    } else if (editingUser.id === 'systemadmin') {
      // System admin password is hardcoded
    } else {
      // Regular admin accounts
      const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
      const updatedAccounts = adminAccounts.map((admin: AdminAccount) => 
        admin.id === editingUser.id 
          ? { ...admin, profile: { ...admin.profile, ...editForm } }
          : admin
      );
      localStorage.setItem('adminAccounts', JSON.stringify(updatedAccounts));
    }

    setUsers(updatedUsers);
    setShowEditModal(false);
    setEditingUser(null);
    addToast('success', 'User profile updated successfully');
  };

  const handleResetPassword = (user: AdminAccount) => {
    setEditingUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(true);
  };

  const handleSavePassword = () => {
    if (!editingUser) return;

    if (!newPassword || !confirmPassword) {
      addToast('error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      addToast('error', 'Password must be at least 6 characters long');
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === editingUser.id 
        ? { ...user, password: newPassword }
        : user
    );

    // Update localStorage
    if (editingUser.id === 'superadmin') {
      localStorage.setItem('superAdminPassword', newPassword);
    } else if (editingUser.id === 'systemadmin') {
      // System admin password is hardcoded, show warning
      addToast('warning', 'System Admin password cannot be changed through this interface');
      setShowPasswordModal(false);
      setEditingUser(null);
      return;
    } else {
      const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts') || '[]');
      const updatedAccounts = adminAccounts.map((admin: AdminAccount) => 
        admin.id === editingUser.id 
          ? { ...admin, password: newPassword }
          : admin
      );
      localStorage.setItem('adminAccounts', JSON.stringify(updatedAccounts));
    }

    setUsers(updatedUsers);
    setShowPasswordModal(false);
    setEditingUser(null);
    addToast('success', 'Password reset successfully');
  };

  const getRoleBadge = (userId: string) => {
    if (userId === 'superadmin') {
      return { label: 'Super Admin', color: 'bg-purple-100 text-purple-700' };
    } else if (userId === 'systemadmin') {
      return { label: 'System Admin', color: 'bg-blue-100 text-blue-700' };
    } else {
      return { label: 'Admin', color: 'bg-green-100 text-green-700' };
    }
  };

  if (!isAuthenticated || !isSuperAdmin) {
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">User Management</h1>
                <p className="text-xs text-slate-500">Manage admin accounts and permissions</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings size={16} />
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
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
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
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
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
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
              />
            </div>
            <div className="text-sm text-slate-600">
              {filteredUsers.length} users found
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{user.profile.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.id).color}`}>
                        {getRoleBadge(user.id).label}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Mail size={14} />
                        <span>{user.profile.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield size={14} />
                        <span>{user.profile.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{user.profile.bio}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Profile"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleResetPassword(user)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Reset Password"
                  >
                    <Key size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Edit User Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-24 resize-none text-slate-900 bg-white/80 backdrop-blur"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle size={16} />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && editingUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-orange-600 mt-0.5" size={16} />
                <div>
                  <p className="text-sm text-orange-800 font-medium">Password Reset</p>
                  <p className="text-xs text-orange-700 mt-1">
                    You are resetting the password for <strong>{editingUser.profile.name}</strong> ({getRoleBadge(editingUser.id).label})
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSavePassword}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Key size={16} />
                  <span>Reset Password</span>
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
      
    <div className="mt-12">
      <AdminFooter />
    </div>
    </>
  );
}
