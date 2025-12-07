"use client";

import { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, LogOut, ArrowLeft, Save, Camera, Mail, Lock } from 'lucide-react';

export default function PortfolioOwnerSettings() {
  const { user, isAuthenticated, logout, getAuthToken, updateProfile } = useUserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    email: '',
    username: '',
    avatar: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        email: user.email || '',
        username: user.username || '',
        avatar: user.avatar || ''
      });
    }
  }, [isAuthenticated, user, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const success = await updateProfile(formData);
      if (success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage('File size must be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      setMessage('File must be JPG, PNG, or GIF');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const updatedFormData = { ...formData, avatar: base64String };
        setFormData(updatedFormData);

        try {
          const success = await updateProfile({ avatar: base64String });
          if (success) {
            setMessage('Avatar updated successfully!');
            e.target.value = '';
          } else {
            setMessage('Failed to update avatar');
            setFormData(prev => ({ ...prev, avatar: user?.avatar || '' }));
          }
        } catch (error) {
          console.error('Avatar update error:', error);
          setMessage('Failed to update avatar');
          setFormData(prev => ({ ...prev, avatar: user?.avatar || '' }));
        }
        setLoading(false);
      };
      
      reader.onerror = () => {
        setMessage('Failed to read file');
        setLoading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Avatar upload error:', error);
      setMessage('Failed to upload avatar');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/portfolio-owner"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User size={20} />
              <span>Profile Information</span>
            </h2>
          </div>
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={formData.avatar || '/default-avatar.svg'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer"
                >
                  <Camera size={16} />
                </label>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-600">JPG, PNG or GIF. Max 2MB.</p>
                <p className="text-xs text-gray-500 mt-1">Click camera icon to upload</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself and your work..."
                maxLength={500}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
