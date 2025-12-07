// Shared message store for System Admin and Super Admin communication

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

// Initial shared messages
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

// In-memory storage (in production, this would be a database)
let messages: SystemMessage[] = [...initialMessages];

// Subscribe to message updates
type MessageListener = (messages: SystemMessage[]) => void;
const listeners: MessageListener[] = [];

export function subscribeToMessages(listener: MessageListener) {
  console.log('Message Store - New subscriber added, total listeners:', listeners.length + 1);
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
      console.log('Message Store - Subscriber removed, total listeners:', listeners.length);
    }
  };
}

function notifyListeners() {
  console.log('Message Store - Notifying', listeners.length, 'listeners');
  console.log('Message Store - Current messages:', messages.length);
  listeners.forEach(listener => listener([...messages]));
}

// API functions
export function getMessages(): SystemMessage[] {
  return [...messages];
}

export function addMessage(message: Omit<SystemMessage, 'id'>): SystemMessage {
  const newMessage: SystemMessage = {
    ...message,
    id: Date.now().toString()
  };
  messages.unshift(newMessage);
  console.log('Message Store - Added message:', newMessage);
  console.log('Message Store - Total messages now:', messages.length);
  notifyListeners();
  return newMessage;
}

export function updateMessage(id: string, updates: Partial<SystemMessage>): SystemMessage | null {
  const index = messages.findIndex(msg => msg.id === id);
  if (index === -1) return null;
  
  messages[index] = { ...messages[index], ...updates };
  notifyListeners();
  return messages[index];
}

export function deleteMessage(id: string): boolean {
  const index = messages.findIndex(msg => msg.id === id);
  if (index === -1) return false;
  
  messages.splice(index, 1);
  notifyListeners();
  return true;
}

export function toggleStarMessage(id: string): SystemMessage | null {
  const message = messages.find(msg => msg.id === id);
  if (!message) return null;
  
  message.isStarred = !message.isStarred;
  notifyListeners();
  return message;
}

export function markMessageAsRead(id: string): SystemMessage | null {
  const message = messages.find(msg => msg.id === id);
  if (!message) return null;
  
  message.status = 'read';
  notifyListeners();
  return message;
}
