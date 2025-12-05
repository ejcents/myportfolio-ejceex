"use client";

import { useState, useEffect } from "react";
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

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`/api/messages?id=${messageId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        setTotalMessages(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Admin</span>
              </button>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">All Messages</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {totalMessages} message{totalMessages !== 1 ? 's' : ''} found
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
              <p>No messages found</p>
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
                      <button
                        onClick={() => openReplyModal(message)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Reply size={14} />
                        <span>Reply</span>
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
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
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Reply Modal */}
      {replyModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Reply to Message</h3>
              <button
                onClick={() => setReplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">From:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedMessage.name} ({selectedMessage.email})</span>
              </div>
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-600">Subject:</span>
                <span className="ml-2 text-sm text-gray-900">{selectedMessage.subject}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Original Message:</span>
                <p className="mt-1 text-sm text-gray-700">{selectedMessage.message}</p>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 resize-none"
                placeholder="Type your reply here..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={!replyText.trim() || sendingReply}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
