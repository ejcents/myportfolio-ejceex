"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Briefcase, FileText, Camera, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";
import AdminLayout from "@/components/AdminLayout";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, profile, updateProfile } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    updateProfile(editedProfile);
    setIsEditing(false);
    addToast('success', 'Profile updated successfully!');
  };

  const handleInputChange = (field: keyof typeof editedProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    router.push('/admin');
    return null;
  }

  return (
    <AdminLayout 
      title="Profile" 
      subtitle="Manage your admin profile information" 
      currentPage="/admin/profile"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-white" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-3xl font-bold bg-transparent border-b border-white/50 outline-none placeholder-white/70 mb-2 w-full"
                    placeholder="Your name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                )}
                
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-transparent border-b border-white/50 outline-none placeholder-white/70 w-full"
                    placeholder="your.email@example.com"
                  />
                ) : (
                  <p className="text-white/80">{profile.email}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Title */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Briefcase size={16} className="mr-2" />
                  Title/Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Your job title"
                  />
                ) : (
                  <p className="text-gray-900">{profile.title}</p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="mr-2" />
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Account Type</span>
              <span className="text-sm font-medium text-gray-900">
                {profile.email.includes('super') ? 'Super Administrator' : 'Portfolio Administrator'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Member Since</span>
              <span className="text-sm font-medium text-gray-900">2024</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">Status</span>
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Active
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Admin Footer */}
      <AdminFooter />
    </AdminLayout>
  );
}
