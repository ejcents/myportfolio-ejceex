"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Search, Filter, Clock, CheckCircle, AlertCircle, Calendar, Mailbox, Reply, Trash2, Star, Settings, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";
import { getMessages, addMessage, deleteMessage, toggleStarMessage, subscribeToMessages, type SystemMessage } from "@/lib/simpleMessageStore";

export default function SystemMessagesPage() {
  const router = useRouter();
  const { isAuthenticated, role, logout } = useAdminAuth();
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [newMessage, setNewMessage] = useState({
    recipient: 'Super Admin',
    subject: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    type: 'general' as 'system_update' | 'security_alert' | 'user_request' | 'maintenance' | 'general'
  });
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');
  const [selectedMessage, setSelectedMessage] = useState<SystemMessage | null>(null);

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Redirect non-system-admin users
  useEffect(() => {
    if (!isAuthenticated || role !== 'systemadmin') {
      router.push('/system');
    }
  }, [isAuthenticated, role, router]);

  // Subscribe to message updates
  useEffect(() => {
    const initialMessages = getMessages();
    console.log('System Admin - Initial messages loaded:', initialMessages.length);
    setMessages(initialMessages);
    
    const unsubscribe = subscribeToMessages((updatedMessages) => {
      console.log('System Admin - Messages updated via localStorage:', updatedMessages.length);
      console.log('System Admin - Messages from Super Admin:', updatedMessages.filter(m => m.sender === 'Super Admin'));
      setMessages(updatedMessages);
    });
    
    return unsubscribe;
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.subject || !newMessage.content) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    console.log('System Admin - Sending message via localStorage:', {
      sender: 'System Administrator',
      recipient: newMessage.recipient,
      subject: newMessage.subject
    });

    addMessage({
      sender: 'System Administrator',
      recipient: newMessage.recipient,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      priority: newMessage.priority,
      type: newMessage.type,
      isStarred: false
    });

    setNewMessage({
      recipient: 'Super Admin',
      subject: '',
      content: '',
      priority: 'medium',
      type: 'general'
    });
    setShowCompose(false);
    addToast('success', 'Message sent to Super Admin');
  };

  const handleStarMessage = (messageId: string) => {
    toggleStarMessage(messageId);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    addToast('success', 'Message deleted');
  };

  const handleRefresh = () => {
    console.log('System Admin - Force refreshing messages');
    const updatedMessages = getMessages();
    console.log('System Admin - Current messages:', updatedMessages);
    setMessages(updatedMessages);
    addToast('success', 'Messages refreshed');
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = !searchTerm || (
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'sent' && message.sender === 'System Administrator') ||
                         (filterType === 'received' && message.sender === 'Super Admin');
    return matchesSearch && matchesFilter;
  });

  console.log('System Admin - Total messages:', messages.length);
  console.log('System Admin - Filtered messages:', filteredMessages.length);
  console.log('System Admin - Messages from Super Admin:', messages.filter(m => m.sender === 'Super Admin'));
  console.log('System Admin - Filter type:', filterType);

  const unreadCount = messages.filter(m => m.status === 'sent' && m.recipient === 'Super Admin').length;

  // Redirect non-authenticated users or wrong role
  useEffect(() => {
    if (!isAuthenticated || role !== 'systemadmin') {
      router.push('/system');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'systemadmin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/system');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">System Messages</h1>
                <p className="text-xs text-slate-500">Communications with Super Admin</p>
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
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
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
        {/* Message Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Send size={16} />
              <span>New Message</span>
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Search size={16} />
              <span>Refresh</span>
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
            >
              <option value="all">All Messages</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
            </select>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Mailbox className="text-blue-500 mr-2" size={24} />
                Messages
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-50 border-blue-300'
                        : message.sender === 'System Administrator'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-blue-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          message.status === 'sent' ? 'bg-blue-500' : 
                          message.status === 'delivered' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <span className="font-medium text-slate-900 text-sm">{message.sender}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarMessage(message.id);
                        }}
                        className="text-slate-400 hover:text-yellow-500 transition-colors"
                      >
                        <Star size={16} className={message.isStarred ? 'fill-yellow-500 text-yellow-500' : ''} />
                      </button>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{message.subject}</h4>
                    <p className="text-slate-600 text-xs mb-2 line-clamp-2">{message.content}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        message.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        message.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {message.priority}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Message Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {selectedMessage ? (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Message Details</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStarMessage(selectedMessage.id)}
                      className="text-slate-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star size={20} className={selectedMessage.isStarred ? 'fill-yellow-500 text-yellow-500' : ''} />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-slate-900">{selectedMessage.sender}</span>
                        <span className="text-slate-500">→</span>
                        <span className="font-medium text-blue-600">{selectedMessage.recipient}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">{selectedMessage.subject}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedMessage.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        selectedMessage.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        selectedMessage.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {selectedMessage.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedMessage.type === 'security_alert' ? 'bg-red-100 text-red-700' :
                        selectedMessage.type === 'system_update' ? 'bg-blue-100 text-blue-700' :
                        selectedMessage.type === 'maintenance' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedMessage.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-slate-700 leading-relaxed">{selectedMessage.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(selectedMessage.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{new Date(selectedMessage.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {selectedMessage.status === 'sent' && <Send size={14} />}
                      {selectedMessage.status === 'delivered' && <Clock size={14} />}
                      {selectedMessage.status === 'read' && <CheckCircle size={14} />}
                      <span className="capitalize">{selectedMessage.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-12 text-center">
                <Mailbox className="text-blue-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Message</h3>
                <p className="text-slate-600">Choose a message from the list to view its details</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Compose Message Modal */}
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowCompose(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Compose Message to Super Admin</h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Recipient</label>
                    <select
                      value={newMessage.recipient}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, recipient: e.target.value }))}
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    >
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                    <select
                      value={newMessage.priority}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    value={newMessage.type}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  >
                    <option value="general">General</option>
                    <option value="system_update">System Update</option>
                    <option value="security_alert">Security Alert</option>
                    <option value="user_request">User Request</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    placeholder="Enter subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32 resize-none text-slate-900 bg-white/80 backdrop-blur"
                    placeholder="Enter your message"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSendMessage}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Send Message</span>
                  </button>
                  <button
                    onClick={() => setShowCompose(false)}
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
    </div>
    
    <div className="mt-12">
      <AdminFooter />
    </div>
    </>
  );
}
