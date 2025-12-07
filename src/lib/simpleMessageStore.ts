// Simple localStorage-based message store for reliable communication

export interface SystemMessage {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'system_update' | 'security_alert' | 'user_request' | 'maintenance' | 'general';
  isStarred: boolean;
}

const STORAGE_KEY = 'admin_messages';

// Initial messages
const initialMessages: SystemMessage[] = [
  {
    id: '1',
    sender: 'System Administrator',
    recipient: 'Super Admin',
    subject: 'System Performance Report',
    content: 'Monthly system performance analysis shows 99.9% uptime with optimal resource utilization. All critical systems are functioning normally.',
    timestamp: '2024-12-06T09:30:00Z',
    status: 'delivered',
    priority: 'medium',
    type: 'system_update',
    isStarred: true
  },
  {
    id: '2',
    sender: 'Super Admin',
    recipient: 'System Administrator',
    subject: 'Security Audit Scheduled',
    content: 'Quarterly security audit will be conducted this Friday. Please ensure all systems are prepared for the assessment.',
    timestamp: '2024-12-05T14:15:00Z',
    status: 'read',
    priority: 'high',
    type: 'security_alert',
    isStarred: false
  },
  {
    id: '3',
    sender: 'System Administrator',
    recipient: 'Super Admin',
    subject: 'Backup System Maintenance',
    content: 'Scheduled maintenance for backup systems completed successfully. All data integrity checks passed.',
    timestamp: '2024-12-04T11:00:00Z',
    status: 'read',
    priority: 'low',
    type: 'maintenance',
    isStarred: false
  },
  {
    id: '4',
    sender: 'System Administrator',
    recipient: 'Super Admin',
    subject: 'System Update Completed',
    content: 'The latest system updates have been successfully deployed across all servers. All services are functioning normally.',
    timestamp: '2024-12-06T10:30:00Z',
    status: 'sent',
    priority: 'medium',
    type: 'system_update',
    isStarred: true
  }
];

// Initialize localStorage if empty
function initializeStorage() {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMessages));
    return initialMessages;
  }
  return JSON.parse(stored);
}

// Get all messages
export function getMessages(): SystemMessage[] {
  if (typeof window === 'undefined') return [];
  
  const messages = localStorage.getItem(STORAGE_KEY);
  return messages ? JSON.parse(messages) : initializeStorage();
}

// Add a new message
export function addMessage(message: Omit<SystemMessage, 'id'>): SystemMessage {
  if (typeof window === 'undefined') {
    const newMessage: SystemMessage = {
      ...message,
      id: Date.now().toString()
    };
    return newMessage;
  }
  
  const messages = getMessages();
  const newMessage: SystemMessage = {
    ...message,
    id: Date.now().toString()
  };
  
  messages.unshift(newMessage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('messagesUpdated', { detail: messages }));
  
  console.log('Simple Store - Message added:', newMessage);
  console.log('Simple Store - Total messages:', messages.length);
  
  return newMessage;
}

// Update a message
export function updateMessage(id: string, updates: Partial<SystemMessage>): SystemMessage | null {
  if (typeof window === 'undefined') return null;
  
  const messages = getMessages();
  const index = messages.findIndex(msg => msg.id === id);
  
  if (index === -1) return null;
  
  messages[index] = { ...messages[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('messagesUpdated', { detail: messages }));
  
  return messages[index];
}

// Delete a message
export function deleteMessage(id: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const messages = getMessages();
  const index = messages.findIndex(msg => msg.id === id);
  
  if (index === -1) return false;
  
  messages.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('messagesUpdated', { detail: messages }));
  
  return true;
}

// Toggle star status
export function toggleStarMessage(id: string): SystemMessage | null {
  if (typeof window === 'undefined') return null;
  
  const messages = getMessages();
  const message = messages.find(msg => msg.id === id);
  
  if (!message) return null;
  
  message.isStarred = !message.isStarred;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('messagesUpdated', { detail: messages }));
  
  return message;
}

// Mark message as read
export function markMessageAsRead(id: string): SystemMessage | null {
  if (typeof window === 'undefined') return null;
  
  const messages = getMessages();
  const message = messages.find(msg => msg.id === id);
  
  if (!message) return null;
  
  message.status = 'read';
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('messagesUpdated', { detail: messages }));
  
  return message;
}

// Subscribe to message updates using custom events
export function subscribeToMessages(callback: (messages: SystemMessage[]) => void) {
  if (typeof window === 'undefined') return () => {};
  
  const handleMessageUpdate = (event: CustomEvent) => {
    callback(event.detail);
  };
  
  // Add event listener
  window.addEventListener('messagesUpdated', handleMessageUpdate as EventListener);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener('messagesUpdated', handleMessageUpdate as EventListener);
  };
}
