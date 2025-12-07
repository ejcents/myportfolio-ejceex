"use client";

import { useState, useEffect } from 'react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Settings, LogOut, ArrowLeft, Save, Camera, Mail, Lock, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [bioLength, setBioLength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      setBioLength(user.bio?.length || 0);
    }
  }, [isAuthenticated, user, router]);

  // Sync form data when user context updates (e.g., after avatar change)
  useEffect(() => {
    if (user && formData.avatar !== user.avatar) {
      setFormData(prev => ({ ...prev, avatar: user.avatar || '' }));
    }
  }, [user, formData.avatar]);

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        if (value && value.length > 50) {
          error = 'First name must be less than 50 characters';
        }
        break;
      case 'lastName':
        if (value && value.length > 50) {
          error = 'Last name must be less than 50 characters';
        }
        break;
      case 'bio':
        if (value.length > 500) {
          error = 'Bio must be less than 500 characters';
        }
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'bio') {
      setBioLength(value.length);
    }
    
    // Validate on change
    validateField(name, value);
  };

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
      // Create a temporary URL for preview (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // Update the avatar in the form data for immediate preview
        const updatedFormData = { ...formData, avatar: base64String };
        setFormData(updatedFormData);

        // Auto-save the avatar using context updateProfile
        try {
          const success = await updateProfile({ avatar: base64String });
          if (success) {
            setMessage('Avatar updated successfully!');
            // Clear the file input
            e.target.value = '';
          } else {
            setMessage('Failed to update avatar');
            // Revert to original avatar on failure
            setFormData(prev => ({ ...prev, avatar: user?.avatar || '' }));
          }
        } catch (error) {
          console.error('Avatar update error:', error);
          setMessage('Failed to update avatar');
          // Revert to original avatar on failure
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

  const handleDeleteAccount = async () => {
    const token = getAuthToken();
    if (!token) {
      setMessage('Authentication required');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        // Clear local storage and redirect
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_data');
        }
        router.push('/');
        setMessage('Account deleted successfully');
      } else {
        setMessage('Failed to delete account');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {

    try {
      const token = getAuthToken();
      if (!token) {
        setMessage('Authentication required');
        return;
      }

      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        setMessage('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage('Failed to update password');
      }
    } catch (error) {
      setMessage('An error occurred');
    } finally {
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
                href="/dashboard"
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
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.lastName}</p>
                )}
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
              <div className="relative">
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.bio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {bioLength}/500
                </div>
              </div>
              {validationErrors.bio && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.bio}</p>
              )}
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

        {/* Password Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Lock size={20} />
              <span>Change Password</span>
            </h2>
          </div>
          <form onSubmit={handlePasswordUpdate} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Shield size={20} />
              <span>Account Actions</span>
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
