"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, LogOut, User, Mail, MapPin, Calendar, Briefcase, Edit2, Check, X, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, login, logout } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const messagesPerPage = 3;
  
  // Portfolio data state
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: {
      name: "Efren Jacob Centillas",
      title: "Creative Designer",
      location: "Buenavista, Bohol",
      age: "21 years",
      experience: "4+ years"
    },
    about: {
      subtitle: "Learn more about my creative skills.",
      heading: "Creative Designer with a Passion for Innovation",
      description: "As a creative designer, I use my passion for design to create visually stunning and user-friendly ",
      education: "University of Technology, 2018-2022",
      interests: ["Web Development", "Machine Learning", "UI/UX Design", "Open Source", "Cloud Computing", "Mobile Development"]
    },
    availability: {
      available: true,
      message: "I'm currently available for freelance work and full-time opportunities. My typical response time is within 24 hours."
    },
    contact: {
      email: "contact@example.com",
      phone: "+1 (555) 123-4567",
      address: "San Francisco, CA"
    }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      setPortfolioData(JSON.parse(savedData));
    }
  }, []);

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

  // Save data to localStorage and refresh content
  const saveData = () => {
    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
    setSaveStatus("saved");
    
    // Trigger a custom event to notify other components of data changes
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: portfolioData }));
    
    setTimeout(() => {
      setSaveStatus("");
      setIsEditing(false); // Exit edit mode after saving
    }, 1500);
  };

  // Handle authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password authentication (in production, use proper auth)
    if (password === "admin123") {
      login();
      setPassword("");
    } else {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    setPassword("");
  };

  // Update portfolio data
  const updateData = (section: string, field: string, value: any) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-blue-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your password to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-white p-1 rounded"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {saveStatus === "error" && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                Incorrect password. Please try again.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="text-blue-600" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Status */}
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              saveStatus === "saved" 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}
          >
            {saveStatus === "saved" ? "Changes saved successfully!" : "Error saving changes"}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-lg transition-colors ${
                    isEditing 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isEditing ? <Check size={20} /> : <Edit2 size={20} />}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo.name}
                    onChange={(e) => updateData("personalInfo", "name", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo.title}
                    onChange={(e) => updateData("personalInfo", "title", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo.location}
                    onChange={(e) => updateData("personalInfo", "location", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo.age}
                    onChange={(e) => updateData("personalInfo", "age", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <input
                    type="text"
                    value={portfolioData.personalInfo.experience}
                    onChange={(e) => updateData("personalInfo", "experience", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <MessageSquare size={20} />
                  <span>Contact Messages</span>
                </h2>
                <button
                  onClick={fetchMessages}
                  disabled={loadingMessages}
                  className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {loadingMessages ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No messages received yet</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{message.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                message.status === 'unread' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {message.status === 'unread' ? 'Unread' : 'Read'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center space-x-1">
                                <Mail size={14} />
                                <span>{message.email}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">{message.subject}</p>
                            <p className="text-gray-600">{message.message}</p>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                          {message.status === 'unread' && (
                            <button
                              onClick={() => updateMessageStatus(message.id, 'read')}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                            >
                              <CheckCircle size={14} />
                              <span>Mark as Read</span>
                            </button>
                          )}
                          {message.status === 'read' && (
                            <button
                              onClick={() => updateMessageStatus(message.id, 'unread')}
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                              <AlertCircle size={14} />
                              <span>Mark as Unread</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Showing {messages.length} of {totalMessages} messages
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Next
                        </button>
                        <button
                          onClick={() => router.push('/admin/messages')}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          See All Messages
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">About Section</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={portfolioData.about.subtitle}
                    onChange={(e) => updateData("about", "subtitle", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                  <input
                    type="text"
                    value={portfolioData.about.heading}
                    onChange={(e) => updateData("about", "heading", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={portfolioData.about.description}
                    onChange={(e) => updateData("about", "description", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                  <input
                    type="text"
                    value={portfolioData.about.education}
                    onChange={(e) => updateData("about", "education", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={portfolioData.contact.email}
                    onChange={(e) => updateData("contact", "email", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={portfolioData.contact.phone}
                    onChange={(e) => updateData("contact", "phone", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={portfolioData.contact.address}
                    onChange={(e) => updateData("contact", "address", e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Availability Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Available for work</span>
                  <button
                    onClick={() => updateData("availability", "available", !portfolioData.availability.available)}
                    disabled={!isEditing}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      portfolioData.availability.available ? "bg-blue-600" : "bg-gray-200"
                    } disabled:opacity-50`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        portfolioData.availability.available ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability Message</label>
                  <textarea
                    value={portfolioData.availability.message}
                    onChange={(e) => updateData("availability", "message", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actions</h2>
              
              <div className="space-y-4">
                <button
                  onClick={saveData}
                  disabled={!isEditing}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Save size={20} />
                  <span>Save Changes</span>
                </button>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isEditing 
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                  <span>{isEditing ? "Cancel Editing" : "Enable Editing"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
