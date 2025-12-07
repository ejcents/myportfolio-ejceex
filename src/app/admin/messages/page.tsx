"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Clock, CheckCircle, AlertCircle, ArrowLeft, Search, Filter, Reply, Trash2, X, Send, Mailbox } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import ToastContainer from "@/components/ToastContainer";
import AdminFooter from "@/components/AdminFooter";
import AdminLayout from "@/components/AdminLayout";

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

  // Redirect to login if not authenticated (but not during any operations)
  useEffect(() => {
    if (!isAuthenticated && !sendingReply && !loadingMessages) {
      router.push('/admin');
    }
  }, [isAuthenticated, router, sendingReply, loadingMessages]);

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
      } else {
        console.error('Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      // Don't show toast for status update errors to avoid confusion
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
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
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
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle response safely
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        addToast('error', 'Email service temporarily unavailable. Please try again later.');
        return;
      }
      
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
        // Don't expose detailed errors to user, just show generic message
        addToast('error', 'Failed to send reply. Please check your email configuration and try again.');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      
      // Handle different types of errors gracefully
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (error instanceof Error && error.name === 'AbortError') {
        addToast('error', 'Request timed out. Please check your internet connection and try again.');
      } else if (errorMessage && errorMessage.includes('fetch')) {
        addToast('error', 'Network error. Please check your connection and try again.');
      } else {
        addToast('error', 'Failed to send reply. Please try again later.');
      }
    } finally {
      setSendingReply(false);
    }
  };

  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  return (
    <AdminLayout 
      title="Messages" 
      subtitle="Manage contact form submissions" 
      currentPage="/admin/messages"
    >
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages List */}
        {loadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                      {message.status === 'unread' && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{message.email}</p>
                    <p className="text-gray-900 font-medium mb-2">{message.subject}</p>
                    <p className="text-gray-600 line-clamp-2">{message.message}</p>
                    <p className="text-sm text-gray-500 mt-3">
                      {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {message.status === 'unread' && (
                      <button
                        onClick={() => updateMessageStatus(message.id, 'read')}
                        className="p-2 text-amber-500 hover:text-amber-600 transition-colors"
                        title="Mark as read"
                      >
                        <Mail size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => openReplyModal(message)}
                      className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                      title="Reply"
                    >
                      <Reply size={20} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(message)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Mailbox className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Messages from your contact form will appear here'
              }
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalMessages > messagesPerPage && (
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * messagesPerPage) + 1} to {Math.min(currentPage * messagesPerPage, totalMessages)} of {totalMessages} messages
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {currentPage} of {Math.ceil(totalMessages / messagesPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalMessages / messagesPerPage)))}
                disabled={currentPage === Math.ceil(totalMessages / messagesPerPage)}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {replyModalOpen && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reply to {selectedMessage.name}</h3>
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Original message:</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-900">{selectedMessage.message}</p>
                </div>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && messageToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Message</h3>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the message from <strong>{messageToDelete.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteMessage}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Admin Footer */}
      <AdminFooter />
    </AdminLayout>
  );
}
