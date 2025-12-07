"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mailbox, Send, Reply, Forward, Trash2, Archive, Star, Search, Filter, Plus, User, Calendar, Clock, Shield, LogOut, Users, Key, Eye, EyeOff, Settings, MessageSquare, Activity, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import { getMessages, addMessage, deleteMessage, toggleStarMessage, markMessageAsRead, subscribeToMessages, type SystemMessage } from "@/lib/simpleMessageStore";
import AdminFooter from "@/components/AdminFooter";

export default function SuperAdminMessagesPage() {
  const router = useRouter();
  const { isAuthenticated, isSuperAdmin, role, logout } = useAdminAuth();
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SystemMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'system_update' | 'security_alert' | 'user_request' | 'maintenance' | 'general'>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<SystemMessage | null>(null);
  const [forwardMessage, setForwardMessage] = useState<SystemMessage | null>(null);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
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

  // Redirect non-super-admin users
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/super');
    } else if (isAuthenticated && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [isAuthenticated, isSuperAdmin, router]);

  // Subscribe to message updates
  useEffect(() => {
    const initialMessages = getMessages();
    console.log('Super Admin - Initial messages loaded:', initialMessages.length);
    setMessages(initialMessages);
    
    const unsubscribe = subscribeToMessages((updatedMessages) => {
      console.log('Super Admin - Messages updated via localStorage:', updatedMessages.length);
      console.log('Super Admin - Messages for Super Admin:', updatedMessages.filter(m => m.recipient === 'Super Admin'));
      setMessages(updatedMessages);
    });
    
    return unsubscribe;
  }, []);

  const handleMessageClick = (message: SystemMessage) => {
    setSelectedMessage(message);
    if (message.status !== 'read') {
      markMessageAsRead(message.id);
    }
  };

  const handleStarToggle = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStarMessage(messageId);
  };

  const handleDelete = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMessage(messageId);
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    addToast('success', 'Message deleted successfully');
  };

  const handleSendMessage = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    console.log('Super Admin - Sending message via localStorage:', {
      sender: 'Super Admin',
      recipient: newMessage.recipient,
      subject: newMessage.subject
    });

    addMessage({
      sender: 'Super Admin',
      recipient: newMessage.recipient,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      priority: 'medium',
      type: 'general',
      isStarred: false
    });

    setNewMessage({ recipient: '', subject: '', content: '' });
    setShowCompose(false);
    addToast('success', 'Message sent successfully');
  };

  const handleRefresh = () => {
    console.log('Super Admin - Refreshing messages');
    const updatedMessages = getMessages();
    console.log('Super Admin - Current messages:', updatedMessages);
    setMessages(updatedMessages);
    addToast('success', 'Messages refreshed');
  };

  const handleReply = (message: SystemMessage) => {
    setReplyToMessage(message);
    setNewMessage({
      recipient: message.sender,
      subject: `Re: ${message.subject}`,
      content: `\n\n---\nOn ${new Date(message.timestamp).toLocaleDateString()}, ${message.sender} wrote:\n${message.content}`
    });
    setShowReply(true);
  };

  const handleForward = (message: SystemMessage) => {
    setForwardMessage(message);
    setNewMessage({
      recipient: '',
      subject: `Fwd: ${message.subject}`,
      content: `\n\n--- Forwarded message ---\nFrom: ${message.sender}\nDate: ${new Date(message.timestamp).toLocaleDateString()}\nSubject: ${message.subject}\n\n${message.content}`
    });
    setShowForward(true);
  };

  const handleArchive = (messageId: string) => {
    deleteMessage(messageId);
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    addToast('success', 'Message archived successfully');
  };

  const handleSendReply = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    addMessage({
      sender: 'Super Admin',
      recipient: newMessage.recipient,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      priority: 'medium',
      type: 'general',
      isStarred: false
    });

    setNewMessage({ recipient: '', subject: '', content: '' });
    setShowReply(false);
    setReplyToMessage(null);
    addToast('success', 'Reply sent successfully');
  };

  const handleSendForward = () => {
    if (!newMessage.recipient || !newMessage.subject || !newMessage.content) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    addMessage({
      sender: 'Super Admin',
      recipient: newMessage.recipient,
      subject: newMessage.subject,
      content: newMessage.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      priority: 'medium',
      type: 'general',
      isStarred: false
    });

    setNewMessage({ recipient: '', subject: '', content: '' });
    setShowForward(false);
    setForwardMessage(null);
    addToast('success', 'Message forwarded successfully');
  };

  const filteredMessages = messages.filter(message => {
    // Only show messages sent to Super Admin
    if (message.recipient !== 'Super Admin') {
      return false;
    }
    const matchesSearch = !searchTerm || (
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filterType === 'all' || message.type === filterType;
    return matchesSearch && matchesFilter;
  });

  console.log('Super Admin - Total messages:', messages.length);
  console.log('Super Admin - Filtered messages:', filteredMessages.length);
  console.log('Super Admin - Messages for Super Admin:', messages.filter(m => m.recipient === 'Super Admin'));
  console.log('Super Admin - Search term:', searchTerm);
  console.log('Super Admin - Filter type:', filterType);

  const unreadCount = messages.filter(m => m.recipient === 'Super Admin' && m.status !== 'read').length;

  // Redirect non-super-admin users (but allow system admins)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/super');
    } else if (isAuthenticated && role !== 'superadmin' && role !== 'systemadmin') {
      router.push('/admin');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || (role !== 'superadmin' && role !== 'systemadmin')) {
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
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Super Admin</h1>
                <p className="text-xs text-slate-500">Messages ({unreadCount} unread)</p>
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
              onClick={() => router.push('/super')}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => router.push('/super/messages')}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 transition-colors"
            >
              <MessageSquare size={16} />
              <span>Messages</span>
            </button>
            <button
              onClick={() => router.push('/super/users')}
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-300 transition-colors"
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
          </div>
          <div className="text-sm text-slate-600">
            {filteredMessages.length} messages • {unreadCount} unread
          </div>
        </motion.div>

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
                <h3 className="text-xl font-bold text-slate-900">Compose New Message</h3>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                  <select
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  >
                    <option value="">Select recipient</option>
                    <option value="System Administrator">System Administrator</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                    placeholder="Enter subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
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

        {/* Reply Modal */}
        {showReply && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowReply(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Reply to Message</h3>
                <button
                  onClick={() => setShowReply(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              {replyToMessage && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <strong>Replying to:</strong> {replyToMessage.subject}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    From: {replyToMessage.sender}
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                  <input
                    type="text"
                    value={newMessage.recipient}
                    readOnly
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-slate-100 text-slate-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32 resize-none text-slate-900 bg-white/80 backdrop-blur"
                    placeholder="Enter your reply"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSendReply}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Send Reply</span>
                  </button>
                  <button
                    onClick={() => setShowReply(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Forward Modal */}
        {showForward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowForward(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Forward Message</h3>
                <button
                  onClick={() => setShowForward(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              {forwardMessage && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <strong>Forwarding:</strong> {forwardMessage.subject}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    From: {forwardMessage.sender}
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">To</label>
                  <select
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  >
                    <option value="">Select recipient</option>
                    <option value="System Administrator">System Administrator</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32 resize-none text-slate-900 bg-white/80 backdrop-blur"
                    placeholder="Add any additional message"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSendForward}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={16} />
                    <span>Forward Message</span>
                  </button>
                  <button
                    onClick={() => setShowForward(false)}
                    className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6"
            >
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 bg-white/80 backdrop-blur"
                >
                  <option value="all">All Messages</option>
                  <option value="system_update">System Update</option>
                  <option value="security_alert">Security Alert</option>
                  <option value="user_request">User Request</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="general">General</option>
                </select>
              </div>

              {/* Messages */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleMessageClick(message)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-50 border-blue-300'
                        : message.status === 'read'
                        ? 'bg-white border-blue-100 hover:bg-blue-50'
                        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          message.status === 'read' ? 'bg-slate-300' : 'bg-blue-500'
                        }`} />
                        <span className="font-medium text-slate-900 text-sm">{message.sender}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => handleStarToggle(message.id, e)}
                          className="p-1 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Star 
                            size={14} 
                            className={message.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}
                          />
                        </button>
                        <button
                          onClick={(e) => handleDelete(message.id, e)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 size={14} className="text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-slate-900 text-sm mb-1">{message.subject}</h4>
                    <p className="text-slate-600 text-xs line-clamp-2">{message.content}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.type === 'system_update' ? 'bg-purple-100 text-purple-700' :
                        message.type === 'security_alert' ? 'bg-red-100 text-red-700' :
                        message.type === 'user_request' ? 'bg-blue-100 text-blue-700' :
                        message.type === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {message.type.replace('_', ' ')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-lg rounded-2xl border border-blue-100 shadow-xl p-6"
            >
              {selectedMessage ? (
                <div className="space-y-6">
                  {/* Message Header */}
                  <div className="border-b border-blue-100 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Mailbox className="text-white" size={20} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">{selectedMessage.subject}</h2>
                          <p className="text-slate-500 text-sm">From: {selectedMessage.sender}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleReply(selectedMessage)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Reply"
                        >
                          <Reply size={18} className="text-slate-600" />
                        </button>
                        <button 
                          onClick={() => handleForward(selectedMessage)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Forward"
                        >
                          <Forward size={18} className="text-slate-600" />
                        </button>
                        <button 
                          onClick={() => handleArchive(selectedMessage.id)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive size={18} className="text-slate-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(selectedMessage.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{new Date(selectedMessage.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedMessage.type === 'system_update' ? 'bg-purple-100 text-purple-700' :
                        selectedMessage.type === 'security_alert' ? 'bg-red-100 text-red-700' :
                        selectedMessage.type === 'user_request' ? 'bg-blue-100 text-blue-700' :
                        selectedMessage.type === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {selectedMessage.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed">{selectedMessage.content}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-4 pt-4 border-t border-purple-100">
                    <button 
                      onClick={() => handleReply(selectedMessage)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Reply size={16} />
                      <span>Reply</span>
                    </button>
                    <button 
                      onClick={() => handleForward(selectedMessage)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Forward size={16} />
                      <span>Forward</span>
                    </button>
                    <button 
                      onClick={() => handleArchive(selectedMessage.id)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Archive size={16} />
                      <span>Archive</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Mailbox size={48} className="mx-auto mb-4 text-slate-300" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No Message Selected</h3>
                  <p className="text-slate-500">Select a message from the list to view its content</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

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
