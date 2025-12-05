"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Clock, CheckCircle, AlertCircle, ArrowLeft, Search, Filter, Reply, Trash2, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAdminAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error" | "warning"; message: string }>>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<any>(null);
  const messagesPerPage = 10;

  const addToast = (type: "success" | "error" | "warning", message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  // Fetch messages when component mounts or filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [currentPage, searchTerm, statusFilter, isAuthenticated]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: messagesPerPage.toString(),
        search: searchTerm,
        status: statusFilter,
      });
      
      const response = await fetch(`/api/messages?${params}`);
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

  const openDeleteModal = (message: any) => {
    setMessageToDelete(message);
    setDeleteModalOpen(true);
  };

  const deleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      const response = await fetch(`/api/messages?id=${messageToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageToDelete.id));
        setTotalMessages(prev => prev - 1);
        addToast('success', 'Message deleted successfully');
      } else {
        addToast('error', 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      addToast('error', 'Failed to delete message');
    } finally {
      setDeleteModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const openReplyModal = (message: any) => {
    setSelectedMessage(message);
    setReplyText('');
    setReplyModalOpen(true);
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      return;
    }

    setSendingReply(true);
    try {
      console.log('Sending reply to:', selectedMessage.email);
      console.log('Reply content:', replyText);
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedMessage.email,
          subject: selectedMessage.subject,
          message: replyText,
          fromName: 'Portfolio Admin'
        }),
      });
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (response.ok && result.success) {
        // Mark message as read after replying
        await updateMessageStatus(selectedMessage.id, 'read');
        setReplyModalOpen(false);
        setReplyText('');
        setSelectedMessage(null);
        addToast('success', 'Reply sent successfully!');
      } else {
        console.error('API Error:', result);
        addToast('error', `Failed to send reply: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      addToast('error', 'Failed to send reply. Please check console for details.');
    } finally {
      setSendingReply(false);
    }
  };

  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="group flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-indigo-50"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Admin</span>
              </button>
              <div className="h-6 w-px bg-gradient-to-b from-indigo-200 to-indigo-100" />
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur-sm opacity-20"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Communications Center
                </h1>
                <p className="text-slate-500 text-xs uppercase tracking-wide">Message Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative px-4 py-2 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-full">
                  <span className="text-orange-700 text-sm font-semibold">
                    {messages.filter(m => m.status === 'unread').length} new
                  </span>
                </div>
              </div>
              <div className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg">
                <span className="text-slate-700 text-sm font-medium">
                  {totalMessages} total
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{totalMessages}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">All Messages</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <AlertCircle className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{messages.filter(m => m.status === 'unread').length}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Pending</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">Awaiting Response</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{messages.filter(m => m.status === 'read').length}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">Processed</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="text-white" size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-900">{messages.filter(m => new Date(m.createdAt).toDateString() === new Date().toDateString()).length}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Today</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-600">Recent Activity</p>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 p-6 mb-8 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Messages</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 placeholder-slate-500 transition-all duration-200 group-hover:bg-white"
                />
              </div>
            </div>
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter Status</label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 transition-all duration-200 appearance-none cursor-pointer hover:bg-white"
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Pending</option>
                  <option value="read">Processed</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-indigo-100 shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Message Inbox</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {totalMessages} message{totalMessages !== 1 ? 's' : ''} • {messages.filter(m => m.status === 'unread').length} pending
                </p>
              </div>
              <button
                onClick={fetchMessages}
                disabled={loadingMessages}
                className="group px-4 py-2 bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
              >
                <div className={`transition-transform ${loadingMessages ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                  <Clock size={16} />
                </div>
                <span>{loadingMessages ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-indigo-500" size={32} />
              </div>
              <p className="text-xl font-semibold text-slate-700 mb-2">No Messages Found</p>
              <p className="text-slate-500">There are no messages matching your current criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-indigo-50">
              {messages.map((message: any, index: number) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-cyan-50/50 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-bold text-sm">
                            {message.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">{message.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Mail size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-600">{message.email}</span>
                            <span className="text-slate-300">•</span>
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-600">{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          message.status === 'unread' 
                            ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200' 
                            : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${message.status === 'unread' ? 'bg-orange-400' : 'bg-emerald-400'}`}></div>
                          {message.status === 'unread' ? 'Pending Response' : 'Processed'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 mb-1">{message.subject}</p>
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">{message.message}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t border-indigo-50">
                    {message.status === 'unread' && (
                      <button
                        onClick={() => updateMessageStatus(message.id, 'read')}
                        className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 rounded-lg hover:from-emerald-100 hover:to-green-100 transition-all duration-200 text-sm font-medium"
                      >
                        <CheckCircle size={16} className="group-hover:scale-110 transition-transform" />
                        <span>Mark Processed</span>
                      </button>
                    )}
                    {message.status === 'read' && (
                      <button
                        onClick={() => updateMessageStatus(message.id, 'unread')}
                        className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 text-orange-700 rounded-lg hover:from-orange-100 hover:to-yellow-100 transition-all duration-200 text-sm font-medium"
                      >
                        <AlertCircle size={16} className="group-hover:scale-110 transition-transform" />
                        <span>Mark Pending</span>
                      </button>
                    )}
                    <button
                      onClick={() => openReplyModal(message)}
                      className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-200 text-indigo-700 rounded-lg hover:from-indigo-100 hover:to-cyan-100 transition-all duration-200 text-sm font-medium"
                    >
                      <Reply size={16} className="group-hover:scale-110 transition-transform" />
                      <span>Reply</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(message)}
                      className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 rounded-lg hover:from-red-100 hover:to-pink-100 transition-all duration-200 text-sm font-medium"
                    >
                      <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                      <span>Delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-indigo-50">
                <div className="text-sm text-slate-600">
                  Showing {messages.length} of {totalMessages} messages
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </motion.div>

      {/* Reply Modal */}
      {replyModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Reply to Message</h3>
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="mb-2">
                  <span className="text-sm font-medium text-slate-600">From:</span>
                  <span className="ml-2 text-sm text-slate-900">{selectedMessage.name} ({selectedMessage.email})</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-slate-600">Subject:</span>
                  <span className="ml-2 text-sm text-slate-900">{selectedMessage.subject}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Message:</span>
                  <p className="mt-1 text-sm text-slate-700">{selectedMessage.message}</p>
                </div>
              </div>

              <form onSubmit={sendReply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reply Message
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    placeholder="Type your reply here..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setReplyModalOpen(false)}
                    className="px-4 py-2 text-slate-700 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-xl hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {sendingReply ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && messageToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                Delete Message
              </h3>
              
              <p className="text-slate-600 text-center mb-6">
                Are you sure you want to delete this message from <span className="font-semibold text-slate-900">{messageToDelete.name}</span>? This action cannot be undone.
              </p>

              <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-sm">
                  <div className="font-medium text-slate-700 mb-1">Subject:</div>
                  <div className="text-slate-600 truncate">{messageToDelete.subject}</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setMessageToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteMessage}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
}
